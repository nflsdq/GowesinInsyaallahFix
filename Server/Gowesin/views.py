from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Pelanggan, Stasiun, Sepeda, Peminjaman, Pembayaran
from .serializers import (
    PelangganSerializer, StasiunSerializer,
    SepedaSerializer, PeminjamanSerializer,
    PembayaranSerializer,
)

class PelangganViewSet(viewsets.ModelViewSet):
    queryset = Pelanggan.objects.all()
    serializer_class = PelangganSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Pelanggan.objects.filter(user=self.request.user)

class StasiunViewSet(viewsets.ModelViewSet):
    queryset = Stasiun.objects.all()
    serializer_class = StasiunSerializer

class SepedaViewSet(viewsets.ModelViewSet):
    queryset = Sepeda.objects.all()
    serializer_class = SepedaSerializer

from rest_framework.decorators import action
from django.db.models import Sum

class SepedaPemilikViewSet(viewsets.ModelViewSet):
    serializer_class = SepedaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.pelanggan.role == 'pemilik':
            return Sepeda.objects.filter(pemilik=user.pelanggan)
        return Sepeda.objects.none()
    
    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(pemilik=user.pelanggan)

    def perform_update(self, serializer):
        user = self.request.user
        serializer.save(pemilik=user.pelanggan)

    @action(detail=False, methods=['GET'])
    def income(self, request):
        if request.user.pelanggan.role != 'pemilik':
            return Response({'detail': 'Anda tidak memiliki akses.'}, status=403)
        
        sepeda_pemilik = self.get_queryset()
        
        bike_incomes = []
        for sepeda in sepeda_pemilik:
            total_income = Peminjaman.objects.filter(
                sepeda=sepeda, 
                status_pembayaran='Sudah Dibayar'
            ).aggregate(total=Sum('total_biaya'))['total'] or 0
            
            bike_incomes.append({
                'id_sepeda': sepeda.id_sepeda,
                'jenis_sepeda': sepeda.get_jenis_sepeda_display(),
                'total_pendapatan': float(total_income)
            })
        
        total_pendapatan_keseluruhan = sum(bike['total_pendapatan'] for bike in bike_incomes)
        
        return Response({
            'detail_pendapatan': bike_incomes,
            'total_pendapatan': total_pendapatan_keseluruhan
        })

class PeminjamanViewSet(viewsets.ModelViewSet):
    queryset = Peminjaman.objects.all()
    serializer_class = PeminjamanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Peminjaman.objects.filter(pelanggan=self.request.user.pelanggan)

    def create(self, request, *args, **kwargs):
        ongoing_rental = Peminjaman.objects.filter(
            pelanggan=request.user.pelanggan, 
            waktu_pengembalian__isnull=True,
            status_pembayaran='Belum Dibayar'
        ).exists()

        if ongoing_rental:
            return Response({'detail': 'Anda masih memiliki peminjaman yang belum dikembalikan.'}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        if request.user.pelanggan.role != 'peminjam':
            return Response({'detail': 'Hanya peminjam yang dapat meminjam sepeda.'}, 
                            status=status.HTTP_400_BAD_REQUEST)

        sepeda_id = request.data.get('sepeda')
        sepeda = get_object_or_404(Sepeda, id_sepeda=sepeda_id)
        
        if sepeda.status_sepeda != 'T':
            return Response({'detail': 'Sepeda tidak tersedia.'}, status=status.HTTP_400_BAD_REQUEST)

        peminjaman = Peminjaman.objects.create(
            pelanggan=request.user.pelanggan,
            sepeda=sepeda,
            stasiun_pengambilan=sepeda.stasiun
        )
        
        sepeda.status_sepeda = 'D'
        sepeda.save()

        serializer = self.get_serializer(peminjaman)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class PeminjamanPemilikViewSet(viewsets.ModelViewSet):
    serializer_class = PeminjamanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.pelanggan.role == 'pemilik':
            sepeda_pemilik = Sepeda.objects.filter(pemilik=user.pelanggan)
            return Peminjaman.objects.filter(sepeda__in=sepeda_pemilik)
        
        return Peminjaman.objects.none()

class PembayaranViewSet(viewsets.ModelViewSet):
    queryset = Pembayaran.objects.all()
    serializer_class = PembayaranSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        peminjaman_id = request.data.get('peminjaman')
        metode_pembayaran = request.data.get('metode_pembayaran')

        try:
            peminjaman = Peminjaman.objects.get(id_peminjaman=peminjaman_id)
        except Peminjaman.DoesNotExist:
            return Response({'detail': 'Peminjaman tidak ditemukan.'}, status=status.HTTP_404_NOT_FOUND)

        if peminjaman.status_pembayaran == 'Sudah Dibayar':
            return Response({'detail': 'Peminjaman sudah dibayar.'}, status=status.HTTP_400_BAD_REQUEST)

        pembayaran = Pembayaran.objects.create(
            peminjaman=peminjaman,
            metode_pembayaran=metode_pembayaran,
            jumlah_pembayaran=peminjaman.total_biaya
        )

        peminjaman.status_pembayaran = 'Sudah Dibayar'
        peminjaman.save()

        sepeda = peminjaman.sepeda
        sepeda.save()

        serializer = self.get_serializer(pembayaran)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

from rest_framework.views import APIView
from rest_framework.authtoken.models import Token

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            token, created = Token.objects.get_or_create(user=user)

            role = None
            try:
                role = user.pelanggan.role
            except AttributeError:
                role = 'peminjam'

            return Response({'token': token.key,
                             'role': role,
                             'username':user.username,
                             'id': user.id}, status=status.HTTP_200_OK)
        
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(APIView):
    def post(self, request):
        print("POST request received")
        username = request.data.get('username')
        nama = request.data.get('nama')
        email = request.data.get('email')
        no_telp = request.data.get('no_telp')
        password = request.data.get('password')
        role = request.data.get('role', 'peminjam')
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username sudah terpakai'}, status=status.HTTP_400_BAD_REQUEST)
        
        if Pelanggan.objects.filter(no_telp=no_telp).exists():
            return Response({'error': 'Nomor telepon sudah terpakai'}, status=status.HTTP_400_BAD_REQUEST)
        
        if Pelanggan.objects.filter(email=email).exists():
            return Response({'error': 'Email sudah terpakai'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        Pelanggan.objects.create(user=user, nama=nama, username=username, email=email, no_telp=no_telp, role=role)
        return Response({'success': 'Pendaftaran berhasil'}, status=status.HTTP_201_CREATED)


