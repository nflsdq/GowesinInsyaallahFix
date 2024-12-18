from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PelangganViewSet, StasiunViewSet, SepedaViewSet, SepedaPemilikViewSet, PeminjamanViewSet, PeminjamanPemilikViewSet, PembayaranViewSet, LoginView, RegisterView

router = DefaultRouter()
router.register(r'pelanggan', PelangganViewSet)
router.register(r'stasiun', StasiunViewSet)
router.register(r'sepeda', SepedaViewSet)
router.register(r'sepeda-pemilik', SepedaPemilikViewSet, basename='sepeda-pemilik')
router.register(r'peminjaman', PeminjamanViewSet)
router.register(r'peminjaman-pemilik', PeminjamanPemilikViewSet, basename='peminjaman-pemilik')
router.register(r'pembayaran', PembayaranViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('login/', LoginView.as_view()),
    path('register/', RegisterView.as_view()),
]
