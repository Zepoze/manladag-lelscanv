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

async function _getUrlPages(manga:mangalelscanv,chapter:number):Promise<string[]> {
    const { numberPage, dom } = await _getNumberPage(manga,chapter)
    const tabURL:Promise<string>[] = []
    for(let i =1;i<=numberPage;i++) tabURL.push( _getUrlOfPage(i,manga,chapter, i==1 ? dom: undefined))
    return Promise.all(tabURL)
}

async function _getNumberPage(manga:mangalelscanv,chapter:number): Promise<{numberPage:number,dom:JSDOM}> {
    const dom = await JSDOM.fromURL('http://lelscanv.com'+manga.path+'/'+chapter,{
        includeNodeLocations: true
    })

    const tabEl = new Array<Element>()
    dom.window.document.querySelectorAll('#navigation a').forEach(e => {
        tabEl.push(e)
    })

    const nb = tabEl.map(e=> e.innerHTML).filter(e => parseInt(e)>0).length

    return Promise.resolve({numberPage:nb,dom})
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

async function _getUrlOfPage(page:number,manga:mangalelscanv,chapter:number ,dom?: JSDOM) {

    const DomPage = dom ? dom : await JSDOM.fromURL('http://lelscanv.com'+manga.path+'/'+chapter+'/'+page)

    const img = DomPage.window.document.querySelector('#image img')
    let pageUrl:string|undefined
    if(img) {
        const src = img.getAttribute('src')
        if(src) pageUrl = src.replace(/(.+\/(\d{1,})\.(png|jpg))(.+)/,'$1')
    }
    if(pageUrl == undefined) throw new Error(`Impossible to get page\'s url n°${page} of ${manga.name} n°${chapter}`)
    return url+pageUrl
}

export const LelScanv:source = {
    mangas: Mangas,site:'LelScanv',
    url,
    getNumberPageChapter:async (m:mangalelscanv,c) => (await _getNumberPage(m,c)).numberPage,
    getUrlPages:_getUrlPages,
    chapterIsAvailable:_chapterIsAvailable,
    getLastChapter:_getLastChapter
}