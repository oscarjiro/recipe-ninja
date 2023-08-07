from django import template
from ..utils import format_time


register  = template.Library()


@register.filter
def format_time_filter(minutes):
    return format_time(minutes)
