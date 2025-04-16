# type: ignore
# flake8: noqa
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#| include: false
import sys
import os
import altair as alt

# Set up path and environment
sys.path.append(os.path.abspath("."))
alt.renderers.enable('default')
os.makedirs("outputs", exist_ok=True)

# Import visualization functions
from py.photo_effect_plot import plot_photo_effect
from py.case_type_bar import plot_case_type
from py.income_dot_map import plot_income_dot_map
from py.income_choropleth import plot_income_choropleth
from py.subset_selection_plot import plot_subset_selection

# Pre-generate all HTML files to ensure they exist
_ = plot_photo_effect()
_ = plot_case_type()
_ = plot_income_dot_map()
_ = plot_income_choropleth()
_ = plot_subset_selection()
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
