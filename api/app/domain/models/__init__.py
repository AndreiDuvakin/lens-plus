from sqlalchemy.orm import declarative_base

Base = declarative_base()

from app.domain.models.appointment_files import AppointmentFile
from app.domain.models.appointments import Appointment
from app.domain.models.appointment_types import AppointmentType
from app.domain.models.lens_types import LensType
from app.domain.models.lens_issues import LensIssue
from app.domain.models.lens import Lens
from app.domain.models.mailing_delivery_methods import MailingDeliveryMethod
from app.domain.models.mailing_options import MailingOption
from app.domain.models.mailing import Mailing
from app.domain.models.patients import Patient
from app.domain.models.recipients import Recipient
from app.domain.models.roles import Role
from app.domain.models.set_contents import SetContent
from app.domain.models.set_lens import SetLens
from app.domain.models.sets import Set
from app.domain.models.users import User
