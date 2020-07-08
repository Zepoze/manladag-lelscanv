import { JSDOM } from 'jsdom'

export const url:string = 'http://lelscanv.com'

declare interface mangalelscanv extends manga {
    keyName: string
}

const Mangas:{[name:string]:mangalelscanv} = {
    'one-piece':{
        name : 'One Piece',
        keyName: 'one-piece',
    },
    'dr-stone':{
        name: 'Dr Stone',
        keyName: 'dr-stone'
    },
    'the-seven-deadly-sins':{
        name: 'The Seven Deadly Sins',
        keyName: 'the-seven-deadly-sins'
    },
    'one-punch-man': {
        name: 'One Punch Man',
        keyName: 'one-punch-man'
    },
    'my-hero-academia': {
        name: 'My Hero Academia',
        keyName: 'my-hero-academia'
    },
    'black-clover': {
        name: 'Black Clover',
        keyName: 'black-clover'
    },
    'hajime-no-ippo': {
        name: 'Hajime No Ippo',
        keyName: 'hajime-no-ippo'
    },
    'dragon-ball-super': {
        name: 'Dragon Ball Super',
        keyName: 'dragon-ball-super'
    },
    'd-gray-man': {
        name: 'D Gray Man',
        keyName: 'd-hray-name'
    },
    'shingeki-no-kyojin': {
        name: 'Shingeki No Kyojin',
        keyName: 'shingeki-no-kyojin'
    },
    'tokyo-shinobi-squad': {
        name: 'Tokyo Shinobi Squad',
        keyName: 'tokyo-shinobi-squad'
    },
    'boruto': {
        name: 'Boruto',
        keyName: 'boruto'
    },
    'hunter-x-hunter': {
        name: 'Hunter X Hunter',
        keyName: 'hunter-x-hunter'
    },
    'gintama': {
        name: 'Gintama',
        keyName: 'gintama'
    },
    'tokyo-ghoul-re': {
        name: 'Tokyo Ghoul Re',
        keyName: 'tokyo-ghoul-re'
    },
    'magi': {
        name: 'Magi',
        keyName: 'magi'
    },
    'fairy-tail': {
        name: 'Fairy Tail',
        keyName: 'fairy-tail'
    },
    'gantz': {
        name: 'Gantz',
        keyName: 'gantz'
    },
    'toriko': {
        name: 'Toriko',
        keyName: 'toriko'
    },
    'bleach': {
        name: 'Bleach',
        keyName: 'bleach'
    },
    'assassination-classroom': {
        name: 'Assassination Classroom',
        keyName: 'assassination-classroom'
    },
    'naruto': {
        name: 'Naruto',
        keyName: 'naruto'
    },
    'the-breaker-new-waves': {
        name: 'The Breaker New Waves',
        keyName: 'the-breaker-new-waves'
    },
    'naruto-gaiden': {
        name: 'Naruto Gaiden',
        keyName: 'naruto-gaiden'
    },
    'soul-eater': {
        name: 'Soul Eater',
        keyName: 'soul-eater'
    },
    'beelzebub': {
        name: 'Beelzebub',
        keyName: 'beelzebub'
    }
}

async function _getUrlPages(manga:mangalelscanv,chapter:number):Promise<string[]> {
    const numberPage = await _getNumberPage(manga,chapter)
    const tabURL:string[] = []
    for(let i =0;i<numberPage;i++) tabURL.push(
        `${url+'/mangas/'+manga.keyName}/${chapter}/${i<10 ? '0'+i : i}.jpg`
    )
    return Promise.resolve(tabURL)
}

async function _getNumberPage(manga:mangalelscanv,chapter:number): Promise<number> {
    const dom = await JSDOM.fromURL('http://lelscanv.com/scan-'+manga.keyName+'/'+chapter,{
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
    const dom = await JSDOM.fromURL('http://lelscanv.com/scan-'+manga.keyName+'/'+chapter,{
        includeNodeLocations: true
    })
   


    const domChap = dom.window.document.querySelectorAll("#header-image h2 div a span")[2].innerHTML
    
    return Promise.resolve(chapter == parseInt(domChap))
}

async function _getLastChapter(manga:mangalelscanv):Promise<number> {
    try {
        const dom = await JSDOM.fromURL('http://lelscanv.com/lecture-en-ligne-'+manga.keyName,{
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