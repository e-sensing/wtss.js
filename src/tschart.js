/*
  Copyright (C) 2014 National Institute For Space Research (INPE) - Brazil.

  This file is part of JavaScript Client API for Web Time Series Service.

  Web Time Series Service for JavaScript is free software: you can
  redistribute it and/or modify it under the terms of the
  GNU Lesser General Public License as published by
  the Free Software Foundation, either version 3 of the License,
  or (at your option) any later version.

  Web Time Series Service for JavaScript is distributed in the hope that
  it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public License
  along with Web Time Series Service for JavaScript. See LICENSE. If not, write to
  e-sensing team at <esensning-team@dpi.inpe.br>.
*/

'use strict';

// assure visualization 
google.load("visualization", "1", {packages:["corechart"]});

/*
  Time Series Chart API
 */
function tschart(div_chart) {

  this.version = "0.1.0";

  this.div_chart = div_chart;
}

tschart.prototype.draw = function(ts, cm) {

  var timeline = ts.result.timeline;
  var attributes = ts.result.attributes;

  var data_table = [ ];

  var row = [ ];

  row.push("date");

  for(var attr in attributes) {-54
    row.push(attributes[attr].attribute);
  }

  data_table.push(row);

  for(var t in timeline) {
    row = [ ];

    row.push(timeline[t]);

    for(var attr in attributes) {

      if(attributes[attr].values[t] == cm.attributes[attr].missing_value) {
        row.push(null);
      }
      else {
        row.push(attributes[attr].values[t] * cm.attributes[attr].scale_factor);
        
      }
    }
    
    data_table.push(row);
  }

  var data = google.visualization.arrayToDataTable(data_table);

  var options = {
    title: 'Remote Sensing Time Series',
    vAxis: {title: 'Value', titleTextStyle: {color: 'black'}, gridlines: {count: 11}, maxValue:1.0, minValue:0.0},
    hAxis: {title: 'Date', titleTextStyle: {color: 'black'}, gridlines: {count: 10}}
  };

  var chart = new google.visualization.LineChart(document.getElementById(this.div_chart));

  chart.draw(data, options);

  var columns = [];
  var series = {};
  for (var i = 0; i < data.getNumberOfColumns(); i++) {
        columns.push(i);
        if (i > 0) {
            series[i - 1] = {};
        }
  }

  google.visualization.events.addListener(chart, 'select', function () {
    var sel = chart.getSelection();
    // if selection length is 0, we deselected an element
    if (sel.length > 0) {
      // if row is undefined, we clicked on the legend
      if (sel[0].row === null) {
        var col = sel[0].column;
        if (columns[col] == col) {
          // hide the data series
          columns[col] = {
            label: data.getColumnLabel(col),
            type: data.getColumnType(col),
            calc: function () {
              return null;
            }
          };

          // grey out the legend entry
          series[col - 1].color = '#CCCCCC';
        }
        else {
          // show the data series
          columns[col] = col;
          series[col - 1].color = null;
        }
        var view = new google.visualization.DataView(data);
        view.setColumns(columns);
        chart.draw(view, options);
      }
    }
  });

};