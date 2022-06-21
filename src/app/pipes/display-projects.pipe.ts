import {Pipe, PipeTransform} from '@angular/core';
import {ProjectModel} from "../store/models/project.model";

@Pipe({
  name: 'displayProjects'
})
export class DisplayProjectsPipe implements PipeTransform {

  transform(value: ProjectModel[]): ProjectModel[] {
    if (value) {
      return [...value].reverse();
    }
    return [];

  }

}
