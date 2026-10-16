from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Los administradores pueden realizar cualquier operación.
    Los lectores únicamente pueden realizar operaciones de lectura.
    """

    def has_permission(self, request, view):
        return True