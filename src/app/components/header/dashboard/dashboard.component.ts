import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }
  chartType = "BarChart"

  data = [
    ["Qualitative", 900],
    ["Residential Infra", 1000],
    ["Center Infra", 1170],

  ];
  columnNames = ['Year', 'Asia'];
  options = {};
  width = 550;
  height = 400;
  ngOnInit(): void {
  }

}
