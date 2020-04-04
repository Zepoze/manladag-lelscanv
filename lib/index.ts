import { ManladagSource } from '@manladag/source'
import { LelScanv } from './functions'

export default function create():ManladagSource {
    return new ManladagSource(LelScanv)
}


export const Source = LelScanv 
