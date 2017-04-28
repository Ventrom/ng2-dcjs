import { AfterViewInit, ContentChildren, Directive, EventEmitter, Input, Output, OnDestroy, OnInit, QueryList, forwardRef } from '@angular/core';

@Directive({
    selector: 'query'
})
export class QueryComponent implements OnInit {
    @Input() dataSource: any = undefined // universe instance
    @Input() groupBy: any = undefined
    @Input() select: any = undefined
    @Input() filter: any = undefined
    @Output() result = new EventEmitter<any>()

    ngOnInit() {
        if (! this.dataSource) return
        this.dataSource.then((u) => {
            return u.query({
                groupBy: this.groupBy,
                select: this.select,
                filter: this.filter
            })
        }).then((res) => {
            this.result.emit(res)
        })
    }
}