from django.contrib import admin
from django.urls import path
from django.urls.conf import include
from django.views.generic import TemplateView
from django.urls import re_path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('dashboard.urls')),
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),

]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
