import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'masterDataManagementFilter'
})
export class MasterDataManagementFilterPipe implements PipeTransform {

  transform(value: any[], args: { searchBy: string, searchString: string }): unknown {
    if (args.searchBy && args.searchString) {

      const searchBy = args.searchBy.toLowerCase();
      const searchString = args.searchString.toLowerCase();
      if (searchBy === 'partner') {


        return value.filter(data => data.partnerName.toLowerCase() === searchString)
      } else if (searchBy === "training center")
        return value.filter(data => data.tcId.toLowerCase() === searchString)
      else {
        return value;
      }
    } else {
      return value;
    }

  }

}
