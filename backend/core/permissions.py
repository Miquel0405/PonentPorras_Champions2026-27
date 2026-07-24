from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Los administradores pueden realizar cualquier operación.
    Los lectores únicamente pueden realizar operaciones de lectura.
    """

    # def has_permission(self, request, view):
    #     if request.method in permissions.SAFE_METHODS:
    #         return True

    #     return (
    #         request.user.is_authenticated
    #         and request.user.groups.filter(
    #             name="Administradores"
    #         ).exists()
    #     )


    def has_permission(self, request, view):
        user = request.user

        if not user.is_authenticated:
            #return False
            return True

        is_admin = user.groups.filter(
            name="Administradores"
        ).exists()

        is_lector = user.groups.filter(
            name="Lectores"
        ).exists()

        if not (is_admin or is_lector):
            return False

        if request.method in permissions.SAFE_METHODS:
            return True

        return is_admin