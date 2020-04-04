import { manga, source} from "@manladag/source";
import { JSDOM } from 'jsdom'

export const url:string = 'http://lelscanv.com'

declare interface mangalelscanv extends manga {
    path:string,
    pagePath:string
}

const Mangas:{[name:string]:mangalelscanv} = {
    'one-piece':{
        name : 'One Piece',
        path: '/scan-one-piece',
        pagePath : '/one-piece'
    },
    'dr-stone':{
        name: 'Dr Stone',
        path: '/scan-dr-stone',
        pagePath: '/dr-stone'
    },
    'the-seven-deadly-sins':{
        name: 'The Seven Deadly Sins',
        path: '/scan-the-seven-deadly-sins',
        pagePath: '/the-seven-deadly-sins'
    }
}

function _getUrlPages(manga:mangalelscanv,chapter:number,numberPage:number):Promise<string[]> {
    const tabURL:string[] = []
    for(let i =0;i<numberPage;i++) tabURL.push(
        `${url+'/mangas'+manga.pagePath}/${chapter}/${i<10 ? '0'+i : i}.jpg`
    )
    return Promise.resolve(tabURL)
}

async function _getNumberPage(manga:mangalelscanv,chapter:number): Promise<number> {
    const dom = await JSDOM.fromURL('http://lelscanv.com'+manga.path+'/'+chapter,{
        includeNodeLocations: true
    })

    const tabEl = new Array<Element>()
    dom.window.document.querySelectorAll('#navigation a').forEach(e => {
        tabEl.push(e)
    })

    const nb = tabEl.map(e=> e.innerHTML).filter(e => parseInt(e)>0).length

    return Promise.resolve(nb)
} 

async function _chapterIsAvailable(manga:mangalelscanv,chapter:number) :Promise<boolean> {
    const dom = await JSDOM.fromURL('http://lelscanv.com'+manga.path+'/'+chapter,{
        includeNodeLocations: true
    })
   


    const domChap = dom.window.document.querySelectorAll("#header-image h2 div a span")[2].innerHTML
    
    return Promise.resolve(chapter == parseInt(domChap))
}

async function _getLastChapter(manga:mangalelscanv):Promise<number> {
    try {
        const dom = await JSDOM.fromURL('http://lelscanv.com/lecture-en-ligne-'+manga.pagePath.slice(1),{
            includeNodeLocations: true
        })
        return Promise.resolve(parseInt(dom.window.document.querySelectorAll("#header-image h2 div a span")[2].innerHTML))
    } catch(e) {
        throw e
    }
}


export const LelScanv:source = {
    mangas: Mangas,site:'LelScanv',
    url,
    getNumberPageChapter:_getNumberPage,
    getUrlPages:_getUrlPages,
    chapterIsAvailable:_chapterIsAvailable,
    getLastChapter:_getLastChapter
}