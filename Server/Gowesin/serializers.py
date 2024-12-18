from rest_framework import serializers
from .models import Pelanggan, Stasiun, Sepeda, Peminjaman, Pembayaran

class PelangganSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pelanggan
        fields = ('__all__')

class StasiunSerializer(serializers.ModelSerializer):
    jumlah_sepeda = serializers.SerializerMethodField()
    
    class Meta:
        model = Stasiun
        fields = ('__all__')

    def get_jumlah_sepeda(self, obj):
        return obj.sepeda_set.filter(status_sepeda='T').count()

class SepedaSerializer(serializers.ModelSerializer):
    jenis_sepeda_display = serializers.CharField(source='get_jenis_sepeda_display', read_only=True)
    kondisi_sepeda_display = serializers.CharField(source='get_kondisi_sepeda_display', read_only=True)
    status_sepeda_display = serializers.CharField(source='get_status_sepeda_display', read_only=True)
    stasiun = serializers.PrimaryKeyRelatedField(queryset=Stasiun.objects.all())
    stasiun_detail = StasiunSerializer(source='stasiun', read_only=True)
    biaya_sepeda = serializers.SerializerMethodField()
    pemilik = serializers.SerializerMethodField()

    class Meta:
        model = Sepeda
        fields = ('__all__')

    def get_biaya_sepeda(self, obj):
        return obj.biaya_sepeda()
    
    def get_pemilik(self, obj):
        return obj.pemilik.nama if obj.pemilik else 'Belum Ada'

class PeminjamanSerializer(serializers.ModelSerializer):
    waktu_pengambilan = serializers.DateTimeField(format="%d-%m-%Y %H:%M")
    waktu_pengembalian = serializers.DateTimeField(format="%d-%m-%Y %H:%M")

    sepeda_detail = serializers.SerializerMethodField()
    pelanggan_detail = serializers.SerializerMethodField()
    stasiun_pengambilan_detail = serializers.SerializerMethodField()

    class Meta:
        model = Peminjaman
        fields = '__all__'

    def get_sepeda_detail(self, obj):
        return {
            'id_sepeda': obj.sepeda.id_sepeda,
            'jenis_sepeda_display': obj.sepeda.get_jenis_sepeda_display(),
            'pemilik_id': obj.sepeda.pemilik.id_pelanggan if obj.sepeda.pemilik else None
        }

    def get_pelanggan_detail(self, obj):
        return {
            'id_pelanggan': obj.pelanggan.id_pelanggan,
            'nama': obj.pelanggan.nama,
        }

    def get_stasiun_pengambilan_detail(self, obj):
        if obj.stasiun_pengambilan:
            return {
                'id_stasiun': obj.stasiun_pengambilan.id_stasiun,
                'nama_stasiun': obj.stasiun_pengambilan.nama_stasiun
            }
        return None

class PembayaranSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pembayaran
        fields = ('__all__')