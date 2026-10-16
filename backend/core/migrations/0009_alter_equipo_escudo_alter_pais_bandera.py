
import core.models.equipo
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0008_remove_competicionporra_unique_porra_name_per_competition_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='equipo',
            name='escudo',
            field=models.FileField(
                blank=True,
                null=True,
                upload_to='escudos/',
                validators=[core.models.equipo.validar_escudo],
            ),
        ),
    ]
