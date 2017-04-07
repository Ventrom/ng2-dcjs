import { AfterViewInit, ContentChildren, Directive, Input, OnDestroy, OnInit, QueryList, forwardRef } from '@angular/core';

const universe = require('universe')

@Directive({
    selector: 'query'
})
export class QueryComponent {
    @Input() dataSource: any // universe instance
    @Input() groupBy: any
    @Input() select: any
    @Input() filter: any
    chartsUniverse: any
    result: string = ""
    //@ContentChildren()

    ngOnInit() {
        if (this.dataSource) {
            let self = this
            console.log(this.dataSource)
            universe(this.dataSource)
                .then(function(myUniverse) {
                    console.log(myUniverse)
                    return myUniverse.query({
                        groupBy: 'productIDs',
                        select: {
                            $count: true,
                            tip: {
                                $sum: 'tip',
                                $max: 'tip'
                            }
                        },
                        filter: {
                            date: {
                                $eq: {
                                    $last: {
                                        $column: 'date'
                                    }
                                }
                            }
                        }
                    }).then(function(res){
                        self.result = JSON.stringify(res.data, null, 4)
                        console.log(JSON.stringify(res.data, null, 4))

                        return res.universe
                    })
                })

            /*.then(function(myUniverse){
              return myUniverse.query({
                groupBy: 'productIDs',
                select: {
                  $count: true,
                  tip: {
                    $sum: 'tip',
                    $min: 'tip',
                    $avg: 'tip',
                  }
                }
              })
              .then(function(res){
                document.getElementById('chart2')
                  .innerHTML = JSON.stringify(res.data, null, 4);

                return res.universe
              })
            })
            .then(function(){
              dc.renderAll();
            })*/
        }
    }
}