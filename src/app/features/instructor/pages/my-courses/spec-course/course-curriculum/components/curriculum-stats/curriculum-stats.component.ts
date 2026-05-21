import { Component, Input } from '@angular/core';
import { Curriculum } from '../../../../../../../../core/services/Curriculm/curriculm.service';

@Component({
  selector: 'app-curriculum-stats',
  standalone: true,
  templateUrl: './curriculum-stats.component.html',
})
export class CurriculumStatsComponent {
  @Input() curriculum!: Curriculum;
}
