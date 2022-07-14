from rolepermissions.roles import AbstractUserRole

class Admin(AbstractUserRole):
    available_permissions = {
        'create_project': True,
    }

class Labeler(AbstractUserRole):
    available_permissions = {
        'do_label': True,
    }
    
class Reviewer(AbstractUserRole):
    available_permissions = {
        'do_review': True,
    }    