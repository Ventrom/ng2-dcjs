import { Injectable, OnInit } from '@angular/core'

const d3 = require ('d3')

@Injectable()
export class UtilsService implements OnInit {
    isoDateFormat = d3.time.format('%Y-%m-%dT%H:%M:%S')
    //TODO: remove this one
    customFormat = d3.time.format("%a %e %b %H:%M")
    dayHourFormat = d3.time.format("%H:00 %d-%B-%Y")
    dayWeekNameFormat = d3.time.format("%d-%B-%Y")
    monthNameFormat = d3.time.format("%B-%Y")
    yearNameFormat = d3.time.format("%Y")
    numberFormat = d3.format('.2s')
    intFormat = d3.format('f')

    compatibleChartTypes = [
        ["pie", "row"],
        ["sand", "line"],
        ["candle"],
        ["bar"],
        ["geo"]
    ]

    constructor() {}

    ngOnInit() {}

    parenthesize(x: string, spacePadding?: number) {
        return spacePadding ? "( " + x + " )" : "(" + x + ")"
    }

    capitalizeFirstLetter(x: string) {
        return x.charAt(0).toUpperCase() + x.slice(1)
    }

    toNumberFormat(v: number) {
        if (!Number.isNaN(v)) {
            return this.numberFormat(v)
        } else {
            return this.numberFormat(0)
        }
    }

    toWord(n) {
        return ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen"][n]
    }

    copyProperties(dest, source) {
        Object.keys(source).forEach(key => {
            Object.defineProperty(dest, key, {
                  value: (key === "writable") ? true : source[key]
            });
        });
    }
}