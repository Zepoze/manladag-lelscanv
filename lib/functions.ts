import { JSDOM } from 'jsdom'
import {Manladag} from '@manladag/source'
export const url:string = 'http://lelscan.net'

interface mangalelscanv extends Manladag.manga {
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
        keyName: 'd-gray-man'
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
    },
    'solo-leveling': {
        name: 'Solo Leveling',
        keyName: 'solo-leveling'
    },
    'tokyo-revengers': {
        name: 'Tokyo Revengers',
        keyName: 'tokyo-revengers'
    },
    "fire-force": {
		"name": "Fire Force",
		"keyName": "fire-force"
	},
    "four-knights-of-the-apocalypse": {
		"name": "Four Knights Of The Apocalypse",
		"keyName": "four-knights-of-the-apocalypse"
	},
    "kingdom": {
		"name": "Kingdom",
		"keyName": "kingdom"
	},
    "blue-lock": {
		"name": "Blue Lock",
		"keyName": "blue-lock"
	},
    "kaiju-no-8": {
		"name": "Kaiju No 8",
		"keyName": "kaiju-no-8"
	},
    "juujika-no-rokunin": {
		"name": "Juujika No Rokunin",
		"keyName": "juujika-no-rokunin"
    }
}

async function _getUrlPages(manga:mangalelscanv,chapter:number):Promise<string[]> {
    const { numberPage, dom } = await _getNumberPage(manga,chapter)
    const tabURL:Promise<string>[] = []
    for(let i =1;i<=numberPage;i++) tabURL.push( _getUrlOfPage(i,manga,chapter, i==1 ? dom: undefined))
    return Promise.all(tabURL)
}

async function _getNumberPage(manga:mangalelscanv,chapter:number): Promise<{numberPage:number,dom:JSDOM}> {
    const dom = await JSDOM.fromURL(url+'/scan-'+manga.keyName+'/'+chapter,{
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
    const dom = await JSDOM.fromURL(url+'/scan-'+manga.keyName+'/'+chapter,{
        includeNodeLocations: true
    })
   


    const domChap = dom.window.document.querySelectorAll("#header-image h2 div a span")[2].innerHTML
    
    return Promise.resolve(chapter == parseInt(domChap))
}

async function _getLastChapter(manga:mangalelscanv):Promise<number> {
    try {
        const dom = await JSDOM.fromURL(url+'/lecture-en-ligne-'+manga.keyName,{
            includeNodeLocations: true
        })
        return Promise.resolve(parseInt(dom.window.document.querySelectorAll("#header-image h2 div a span")[2].innerHTML))
    } catch(e) {
        throw e
    }
}

async function _getUrlOfPage(page:number,manga:mangalelscanv,chapter:number ,dom?: JSDOM) {

    const DomPage = dom ? dom : await JSDOM.fromURL(url+'/scan-'+manga.keyName+'/'+chapter+'/'+page)

    const img = DomPage.window.document.querySelector('#image img')
    let pageUrl:string|undefined
    if(img) {
        const src = img.getAttribute('src')
        if(src) pageUrl = src.replace(/(.+\/(\d{1,})\.(png|jpg))(.+)/,'$1')
    }
    if(pageUrl == undefined) throw new Error(`Impossible to get page\'s url n°${page} of ${manga.name} n°${chapter}`)
    return DomPage.window._origin+pageUrl
}

async function _getChaptersAvailable(manga:mangalelscanv,fromChapter: number, toChapter: number): Promise<number[]>{
    try {
        const dom = await JSDOM.fromURL(url+'/lecture-en-ligne-'+manga.keyName,{
            includeNodeLocations: true
        })
        const sortTab = [fromChapter,toChapter].sort((a,b)=> a-b)
        return Promise.resolve(Array.from(dom.window.document.querySelectorAll("#header-image select option")).map((nl)=> parseFloat(nl.innerHTML)).filter(chap => chap >= sortTab[0] &&  chap <= sortTab[1]  ))
    } catch(e) {
        throw e
    }
}

export const LelScanv:Manladag.source = {
    mangas: Mangas,site:'LelScanv',
    url,
    getNumberPageChapter:async (m:mangalelscanv,c) => (await _getNumberPage(m,c)).numberPage,
    getUrlPages:_getUrlPages,
    chapterIsAvailable:_chapterIsAvailable,
    getLastChapter:_getLastChapter,
    getChaptersAvailable: _getChaptersAvailable
}
