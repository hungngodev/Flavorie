import axios from 'axios';
import { ServerError } from '../errors/customErrors.ts';
import Ingredients from '../models/Ingredients.ts';
import ApiTrack from '../models/ApiTrack.ts';

import dotenv from 'dotenv';
dotenv.config();

export const EndPoint = {
    FIND_RECIPES_BY_INGREDIENTS: '/recipes/findByIngredients',
    FIND_INGREDIENTS: '/food/ingredients/search',
    FIND_INGREDIENTS_BY_ID: (id: string) => `/food/ingredients/${id}/information`,
}

const baseURL = axios.create(
    {
        baseURL: process.env.spoonacular_API_ENDPOINT || '',
    }
)

const arrKey = [
    process.env.spoonacular_API_KEY,
    process.env.spoonacular_API_KEY_2,
    process.env.spoonacular_API_KEY_3,
    process.env.spoonacular_API_KEY_4,
    process.env.spoonacular_API_KEY_5,
];
const mockData = {
    "results": [
        {
            "id": 1065062,
            "name": "meat",
            "image": "whole-chicken.jpg",
            "children": [
                {
                    "id": 1015100,
                    "name": "boneless chicken wings"
                },
                {
                    "id": 23557,
                    "name": "lean ground beef"
                },
                {
                    "id": 7065,
                    "name": "saucisses"
                },
                {
                    "id": 10073,
                    "name": "cooked pork"
                },
                {
                    "id": 5179,
                    "name": "turkey necks"
                },
                {
                    "id": 13023,
                    "name": "beef brisket"
                },
                {
                    "id": 10017345,
                    "name": "venison chops"
                },
                {
                    "id": 93794,
                    "name": "bison back ribs"
                },
                {
                    "id": 23625,
                    "name": "sirloin steak"
                },
                {
                    "id": 13523,
                    "name": "top blade steak"
                },
                {
                    "id": 5166,
                    "name": "leftover turkey"
                },
                {
                    "id": 5193,
                    "name": "turkey drumsticks"
                },
                {
                    "id": 0,
                    "name": "rabbit"
                },
                {
                    "id": 23078,
                    "name": "boneless chuck steak"
                },
                {
                    "id": 23636,
                    "name": "round tip steak"
                },
                {
                    "id": 99186,
                    "name": "diced ham"
                },
                {
                    "id": 13958,
                    "name": "tri tip roast"
                },
                {
                    "id": 1005139,
                    "name": "muscovy duck"
                },
                {
                    "id": 5062,
                    "name": "boneless chicken breast"
                },
                {
                    "id": 99008,
                    "name": "turkey tenderloin"
                },
                {
                    "id": 5335,
                    "name": "chicken feet"
                },
                {
                    "id": 10010066,
                    "name": "pork cutlets"
                },
                {
                    "id": 19002,
                    "name": "beef jerky"
                },
                {
                    "id": 5696,
                    "name": "boneless turkey breast"
                },
                {
                    "id": 10010225,
                    "name": "pork roast"
                },
                {
                    "id": 7008,
                    "name": "bologna"
                },
                {
                    "id": 7013,
                    "name": "bratwurst"
                },
                {
                    "id": 10017164,
                    "name": "diced venison"
                },
                {
                    "id": 1045062,
                    "name": "boneless skinless chicken breast halves"
                },
                {
                    "id": 1015114,
                    "name": "grilled chicken"
                },
                {
                    "id": 7081,
                    "name": "sliced turkey"
                },
                {
                    "id": 93713,
                    "name": "roast beef"
                },
                {
                    "id": 1005006,
                    "name": "chicken pieces"
                },
                {
                    "id": 10218,
                    "name": "pork tenderloin"
                },
                {
                    "id": 10013926,
                    "name": "filet mignon"
                },
                {
                    "id": 7278,
                    "name": "turkey pepperoni"
                },
                {
                    "id": 23572,
                    "name": "beef"
                },
                {
                    "id": 99232,
                    "name": "ground chorizo"
                },
                {
                    "id": 13926,
                    "name": "beef tenderloin"
                },
                {
                    "id": 10084,
                    "name": "boston butt"
                },
                {
                    "id": 17164,
                    "name": "venison"
                },
                {
                    "id": 93673,
                    "name": "grouse"
                },
                {
                    "id": 7038,
                    "name": "knackwurst"
                },
                {
                    "id": 1005057,
                    "name": "bone in skin on chicken breast"
                },
                {
                    "id": 7241,
                    "name": "beef franks"
                },
                {
                    "id": 13323,
                    "name": "beef kidney"
                },
                {
                    "id": 10123,
                    "name": "bacon"
                },
                {
                    "id": 23074,
                    "name": "country style beef ribs"
                },
                {
                    "id": 10310123,
                    "name": "thick cut bacon"
                },
                {
                    "id": 93680,
                    "name": "jamon"
                },
                {
                    "id": 1005091,
                    "name": "bone in chicken thighs"
                },
                {
                    "id": 1005696,
                    "name": "bone in skinless turkey breast"
                },
                {
                    "id": 17047,
                    "name": "lamb shoulder"
                },
                {
                    "id": 10072,
                    "name": "pork shoulder"
                },
                {
                    "id": 10010219,
                    "name": "pork"
                },
                {
                    "id": 17104,
                    "name": "veal loin chops"
                },
                {
                    "id": 5027,
                    "name": "chicken liver"
                },
                {
                    "id": 10023572,
                    "name": "ground beef"
                },
                {
                    "id": 5696,
                    "name": "turkey breast"
                },
                {
                    "id": 5114,
                    "name": "roasted chicken"
                },
                {
                    "id": 10066,
                    "name": "lean pork loin chops"
                },
                {
                    "id": 93669,
                    "name": "ham hock"
                },
                {
                    "id": 5150,
                    "name": "goose liver"
                },
                {
                    "id": 10017026,
                    "name": "lamb loin"
                },
                {
                    "id": 23618,
                    "name": "rump roast"
                },
                {
                    "id": 17166,
                    "name": "elk"
                },
                {
                    "id": 93756,
                    "name": "black forest ham"
                },
                {
                    "id": 10010014,
                    "name": "gammon steak"
                },
                {
                    "id": 98913,
                    "name": "turkey thigh"
                },
                {
                    "id": 10017032,
                    "name": "lean rack of lamb"
                },
                {
                    "id": 17276,
                    "name": "veal shank"
                },
                {
                    "id": 1035062,
                    "name": "bone in chicken breast halves"
                },
                {
                    "id": 23236,
                    "name": "ribs"
                },
                {
                    "id": 1045062,
                    "name": "boneless chicken breast halves"
                },
                {
                    "id": 10083,
                    "name": "shoulder joint of pork"
                },
                {
                    "id": 10023003,
                    "name": "porterhouse steak"
                },
                {
                    "id": 98968,
                    "name": "veggie dogs"
                },
                {
                    "id": 93799,
                    "name": "guanciale"
                },
                {
                    "id": 7929,
                    "name": "turkey kielbasa"
                },
                {
                    "id": 98867,
                    "name": "pork knuckle"
                },
                {
                    "id": 10225,
                    "name": "boneless pork loin"
                },
                {
                    "id": 93714,
                    "name": "goose"
                },
                {
                    "id": 17104,
                    "name": "veal chops"
                },
                {
                    "id": 1015062,
                    "name": "chicken tenderloins"
                },
                {
                    "id": 10036,
                    "name": "bone in pork chops"
                },
                {
                    "id": 10035177,
                    "name": "elk steak"
                },
                {
                    "id": 10410123,
                    "name": "pancetta"
                },
                {
                    "id": 5139,
                    "name": "duck"
                },
                {
                    "id": 7071,
                    "name": "salami"
                },
                {
                    "id": 13227,
                    "name": "beef shank"
                },
                {
                    "id": 7259,
                    "name": "deli turkey"
                },
                {
                    "id": 23145,
                    "name": "chuck steak"
                },
                {
                    "id": 7064,
                    "name": "andouille sausage"
                },
                {
                    "id": 10958,
                    "name": "boneless pork shoulder"
                },
                {
                    "id": 17346,
                    "name": "venison shoulder"
                },
                {
                    "id": 5091,
                    "name": "chicken thighs"
                },
                {
                    "id": 13833,
                    "name": "prime rib"
                },
                {
                    "id": 10062,
                    "name": "pork loin chops"
                },
                {
                    "id": 7214,
                    "name": "boiled ham"
                },
                {
                    "id": 5139,
                    "name": "whole duck"
                },
                {
                    "id": 17267,
                    "name": "bison strip loin"
                },
                {
                    "id": 99026,
                    "name": "turkey burgers"
                },
                {
                    "id": 1047063,
                    "name": "sausage patties"
                },
                {
                    "id": 17162,
                    "name": "reindeer"
                },
                {
                    "id": 10044,
                    "name": "bone in pork rib roast"
                },
                {
                    "id": 21118,
                    "name": "hot dogs"
                },
                {
                    "id": 98912,
                    "name": "duck breast"
                },
                {
                    "id": 17094,
                    "name": "veal cutlet"
                },
                {
                    "id": 17177,
                    "name": "rabbit meat"
                },
                {
                    "id": 23617,
                    "name": "round steak"
                },
                {
                    "id": 1007063,
                    "name": "pork sausage"
                },
                {
                    "id": 23653,
                    "name": "beef sirloin tip roast"
                },
                {
                    "id": 35177,
                    "name": "elk roast"
                },
                {
                    "id": 1027063,
                    "name": "breakfast sausage"
                },
                {
                    "id": 1007057,
                    "name": "pepperoni slices"
                },
                {
                    "id": 7050,
                    "name": "mortadella"
                },
                {
                    "id": 1025062,
                    "name": "chicken cutlet"
                },
                {
                    "id": 1005091,
                    "name": "chicken leg quarters"
                },
                {
                    "id": 17180,
                    "name": "whole rabbit"
                },
                {
                    "id": 5165,
                    "name": "whole turkey"
                },
                {
                    "id": 17029,
                    "name": "rack of lamb"
                },
                {
                    "id": 17202,
                    "name": "veal liver"
                },
                {
                    "id": 93795,
                    "name": "bison short ribs"
                },
                {
                    "id": 17023,
                    "name": "lamb loin chop"
                },
                {
                    "id": 99247,
                    "name": "canned chicken breast"
                },
                {
                    "id": 1005100,
                    "name": "chicken drumettes"
                },
                {
                    "id": 23032,
                    "name": "sirloin tip steak"
                },
                {
                    "id": 10023618,
                    "name": "beef cubes"
                },
                {
                    "id": 10963,
                    "name": "pork sirloin tip roast"
                },
                {
                    "id": 10117158,
                    "name": "wild boar shoulder"
                },
                {
                    "id": 10225,
                    "name": "boneless pork roast"
                },
                {
                    "id": 1005091,
                    "name": "bone in skin on chicken thighs"
                },
                {
                    "id": 10093713,
                    "name": "sliced roast beef"
                },
                {
                    "id": 5091,
                    "name": "boneless chicken thighs"
                },
                {
                    "id": 10060,
                    "name": "lean pork tenderloin"
                },
                {
                    "id": 1007071,
                    "name": "soppressata"
                },
                {
                    "id": 5066,
                    "name": "chicken drumsticks"
                },
                {
                    "id": 23059,
                    "name": "flat iron steak"
                },
                {
                    "id": 80200,
                    "name": "frog legs"
                },
                {
                    "id": 10165,
                    "name": "salt pork"
                },
                {
                    "id": 17158,
                    "name": "boar"
                },
                {
                    "id": 7041,
                    "name": "liverwurst"
                },
                {
                    "id": 10017158,
                    "name": "wild boar stew meat"
                },
                {
                    "id": 23167,
                    "name": "skirt steak"
                },
                {
                    "id": 99245,
                    "name": "bacon ends and pieces"
                },
                {
                    "id": 5191,
                    "name": "boneless skin on turkey breast"
                },
                {
                    "id": 5317,
                    "name": "duck leg"
                },
                {
                    "id": 99199,
                    "name": "turkey breast cutlets"
                },
                {
                    "id": 5057,
                    "name": "boneless skin on chicken breast"
                },
                {
                    "id": 10106,
                    "name": "pork kidney"
                },
                {
                    "id": 5100,
                    "name": "chicken wings"
                },
                {
                    "id": 17330,
                    "name": "bison"
                },
                {
                    "id": 5075,
                    "name": "chicken leg"
                },
                {
                    "id": 10023572,
                    "name": "ground chuck"
                },
                {
                    "id": 17142,
                    "name": "ground veal"
                },
                {
                    "id": 0,
                    "name": "chicken"
                },
                {
                    "id": 17305,
                    "name": "lamb chop"
                },
                {
                    "id": 5025,
                    "name": "chicken hearts"
                },
                {
                    "id": 13323,
                    "name": "kidney"
                },
                {
                    "id": 23003,
                    "name": "t bone steak"
                },
                {
                    "id": 7083,
                    "name": "vienna sausage"
                },
                {
                    "id": 1007036,
                    "name": "sweet italian sausage"
                },
                {
                    "id": 99035,
                    "name": "cocktail turkey sausages"
                },
                {
                    "id": 10117345,
                    "name": "venison steak"
                },
                {
                    "id": 5160,
                    "name": "pigeon"
                },
                {
                    "id": 10010062,
                    "name": "pork chops"
                },
                {
                    "id": 10123,
                    "name": "applewood smoked bacon"
                },
                {
                    "id": 10017224,
                    "name": "lamb"
                },
                {
                    "id": 10010005,
                    "name": "pork belly slices"
                },
                {
                    "id": 93778,
                    "name": "oxtail"
                },
                {
                    "id": 1037063,
                    "name": "sausage links"
                },
                {
                    "id": 23507,
                    "name": "beef patties"
                },
                {
                    "id": 10018,
                    "name": "pork shank"
                },
                {
                    "id": 5064,
                    "name": "cooked chicken breast"
                },
                {
                    "id": 10123572,
                    "name": "80 percent lean ground beef"
                },
                {
                    "id": 7927,
                    "name": "italian turkey sausage"
                },
                {
                    "id": 99006,
                    "name": "lean bacon"
                },
                {
                    "id": 5665,
                    "name": "93 percent lean ground turkey"
                },
                {
                    "id": 1005696,
                    "name": "bone in turkey breast"
                },
                {
                    "id": 13943,
                    "name": "beef shoulder roast"
                },
                {
                    "id": 1025057,
                    "name": "boneless skin on chicken breast halves"
                },
                {
                    "id": 10110,
                    "name": "pork liver"
                },
                {
                    "id": 99231,
                    "name": "chorizo sausages"
                },
                {
                    "id": 99030,
                    "name": "lean corned beef"
                },
                {
                    "id": 99013,
                    "name": "turkey bratwurst"
                },
                {
                    "id": 1055062,
                    "name": "boneless skinless chicken breast"
                },
                {
                    "id": 93668,
                    "name": "chicken sausage"
                },
                {
                    "id": 23567,
                    "name": "85 percent lean ground beef"
                },
                {
                    "id": 1025006,
                    "name": "poussin"
                },
                {
                    "id": 93679,
                    "name": "capicola"
                },
                {
                    "id": 10014,
                    "name": "gammon"
                },
                {
                    "id": 99246,
                    "name": "rotisserie chicken"
                },
                {
                    "id": 98944,
                    "name": "pulled pork"
                },
                {
                    "id": 10023562,
                    "name": "ground round"
                },
                {
                    "id": 10123232,
                    "name": "entrecote steak"
                },
                {
                    "id": 7057,
                    "name": "pepperoni"
                },
                {
                    "id": 10010088,
                    "name": "pork spare ribs"
                },
                {
                    "id": 10044,
                    "name": "pork rib roast"
                },
                {
                    "id": 10130,
                    "name": "canadian bacon"
                },
                {
                    "id": 0,
                    "name": "turkey"
                },
                {
                    "id": 93664,
                    "name": "weisswurst"
                },
                {
                    "id": 17199,
                    "name": "lamb liver"
                },
                {
                    "id": 5115,
                    "name": "chicken giblets"
                },
                {
                    "id": 10013346,
                    "name": "corned beef brisket"
                },
                {
                    "id": 98960,
                    "name": "pork escalopes"
                },
                {
                    "id": 23584,
                    "name": "top sirloin steak"
                },
                {
                    "id": 13321,
                    "name": "beef hearts"
                },
                {
                    "id": 98920,
                    "name": "liver cheese"
                },
                {
                    "id": 1005114,
                    "name": "shredded chicken"
                },
                {
                    "id": 10862,
                    "name": "cooked bacon"
                },
                {
                    "id": 23657,
                    "name": "flank steak"
                },
                {
                    "id": 10192,
                    "name": "baby back ribs"
                },
                {
                    "id": 10417158,
                    "name": "leg of wild boar"
                },
                {
                    "id": 10017338,
                    "name": "elk sausage"
                },
                {
                    "id": 10013954,
                    "name": "tri tip steak"
                },
                {
                    "id": 10225,
                    "name": "pork loin"
                },
                {
                    "id": 5006,
                    "name": "whole chicken"
                },
                {
                    "id": 17026,
                    "name": "lean lamb loin chop"
                },
                {
                    "id": 7235,
                    "name": "cocktail sausages"
                },
                {
                    "id": 10023583,
                    "name": "tenderloin steak"
                },
                {
                    "id": 17330,
                    "name": "ground bison"
                },
                {
                    "id": 98992,
                    "name": "sobrasada"
                },
                {
                    "id": 10110151,
                    "name": "country ham"
                },
                {
                    "id": 93681,
                    "name": "jamon iberico"
                },
                {
                    "id": 1015057,
                    "name": "bone in skin on chicken breast halves"
                },
                {
                    "id": 5091,
                    "name": "chicken thigh fillets"
                },
                {
                    "id": 5096,
                    "name": "boneless skinless chicken thighs"
                },
                {
                    "id": 10005,
                    "name": "pork belly"
                },
                {
                    "id": 5175,
                    "name": "turkey hearts"
                },
                {
                    "id": 5114,
                    "name": "cooked chicken"
                },
                {
                    "id": 5311,
                    "name": "canned chicken"
                },
                {
                    "id": 5071,
                    "name": "skinless chicken drumsticks"
                },
                {
                    "id": 42130,
                    "name": "turkey bacon"
                },
                {
                    "id": 5143,
                    "name": "duck liver"
                },
                {
                    "id": 7063,
                    "name": "ground pork sausage"
                },
                {
                    "id": 10110123,
                    "name": "speck"
                },
                {
                    "id": 1045062,
                    "name": "chicken breast halves"
                },
                {
                    "id": 99012,
                    "name": "chicken bratwurst"
                },
                {
                    "id": 10802,
                    "name": "cooked ham"
                },
                {
                    "id": 10151,
                    "name": "ham"
                },
                {
                    "id": 5153,
                    "name": "pheasant"
                },
                {
                    "id": 17337,
                    "name": "bison steak"
                },
                {
                    "id": 98865,
                    "name": "meatloaf mix"
                },
                {
                    "id": 23585,
                    "name": "lean strip steak"
                },
                {
                    "id": 17343,
                    "name": "ground venison"
                },
                {
                    "id": 10194,
                    "name": "boneless pork rib roast"
                },
                {
                    "id": 10210123,
                    "name": "slab bacon"
                },
                {
                    "id": 13786,
                    "name": "beef chuck roast"
                },
                {
                    "id": 13913,
                    "name": "strip steak"
                },
                {
                    "id": 5195,
                    "name": "turkey wings"
                },
                {
                    "id": 93643,
                    "name": "venison ribs"
                },
                {
                    "id": 10117267,
                    "name": "bison sirloin tip roast"
                },
                {
                    "id": 1005662,
                    "name": "ground all white meat turkey"
                },
                {
                    "id": 5307,
                    "name": "cornish hens"
                },
                {
                    "id": 10149,
                    "name": "ham steak"
                },
                {
                    "id": 5157,
                    "name": "quail"
                },
                {
                    "id": 23557,
                    "name": "95 percent lean ground beef"
                },
                {
                    "id": 13923,
                    "name": "beef strip loin"
                },
                {
                    "id": 10088,
                    "name": "spare ribs"
                },
                {
                    "id": 10013149,
                    "name": "bone in beef short ribs"
                },
                {
                    "id": 17353,
                    "name": "lean ground lamb"
                },
                {
                    "id": 93680,
                    "name": "jamon serrano"
                },
                {
                    "id": 23583,
                    "name": "lean filet mignon"
                },
                {
                    "id": 10013149,
                    "name": "beef short ribs"
                },
                {
                    "id": 10017267,
                    "name": "bison tenderloin"
                },
                {
                    "id": 17224,
                    "name": "ground lamb"
                },
                {
                    "id": 5342,
                    "name": "skinless rotisserie chicken"
                },
                {
                    "id": 5162,
                    "name": "pigeon breasts"
                },
                {
                    "id": 7059,
                    "name": "kielbasa"
                },
                {
                    "id": 10017166,
                    "name": "elk tenderloin"
                },
                {
                    "id": 17013,
                    "name": "leg of lamb"
                },
                {
                    "id": 23618,
                    "name": "beef round roast"
                },
                {
                    "id": 10219,
                    "name": "ground pork"
                },
                {
                    "id": 23562,
                    "name": "90 percent lean ground beef"
                },
                {
                    "id": 13325,
                    "name": "liver"
                },
                {
                    "id": 5080,
                    "name": "skinless chicken leg"
                },
                {
                    "id": 17142,
                    "name": "veal"
                },
                {
                    "id": 17268,
                    "name": "bison ribeye"
                },
                {
                    "id": 93714,
                    "name": "whole goose"
                },
                {
                    "id": 10010084,
                    "name": "pork steaks"
                },
                {
                    "id": 1075062,
                    "name": "chicken breast meat"
                },
                {
                    "id": 23569,
                    "name": "cooked beef patties"
                },
                {
                    "id": 10317158,
                    "name": "wild boar shank"
                },
                {
                    "id": 10093795,
                    "name": "bone in bison short ribs"
                },
                {
                    "id": 5193,
                    "name": "turkey leg"
                },
                {
                    "id": 10023567,
                    "name": "ground sirloin"
                },
                {
                    "id": 99286,
                    "name": "chipolata"
                },
                {
                    "id": 10110204,
                    "name": "country style pork ribs"
                },
                {
                    "id": 10017267,
                    "name": "bison sirloin"
                },
                {
                    "id": 7916,
                    "name": "smoked sausage"
                },
                {
                    "id": 7955,
                    "name": "turkey sausage"
                },
                {
                    "id": 10020,
                    "name": "bone in pork roast"
                },
                {
                    "id": 10010151,
                    "name": "ham slices"
                },
                {
                    "id": 93669,
                    "name": "smoked ham hock"
                },
                {
                    "id": 10017158,
                    "name": "wild boar chops"
                },
                {
                    "id": 10020,
                    "name": "bone in pork loin"
                },
                {
                    "id": 17239,
                    "name": "lamb cutlets"
                },
                {
                    "id": 5091,
                    "name": "boneless skin on chicken thighs"
                },
                {
                    "id": 7216,
                    "name": "smoked ham"
                },
                {
                    "id": 17338,
                    "name": "ground elk"
                },
                {
                    "id": 10023618,
                    "name": "beef stew meat"
                },
                {
                    "id": 5109,
                    "name": "roasting chicken"
                },
                {
                    "id": 5167,
                    "name": "turkey meat"
                },
                {
                    "id": 13346,
                    "name": "corned beef"
                },
                {
                    "id": 7908,
                    "name": "spam"
                },
                {
                    "id": 5171,
                    "name": "turkey giblets"
                },
                {
                    "id": 5151,
                    "name": "guinea fowl"
                },
                {
                    "id": 17059,
                    "name": "lamb stew meat"
                },
                {
                    "id": 17156,
                    "name": "bison roast"
                },
                {
                    "id": 1015062,
                    "name": "chicken tenders"
                },
                {
                    "id": 17009,
                    "name": "lamb shanks"
                },
                {
                    "id": 5173,
                    "name": "turkey gizzards"
                },
                {
                    "id": 98937,
                    "name": "rib tips"
                },
                {
                    "id": 10040,
                    "name": "lean bone in pork chop"
                },
                {
                    "id": 5332,
                    "name": "ground chicken"
                },
                {
                    "id": 10110088,
                    "name": "pork ribs"
                },
                {
                    "id": 13149,
                    "name": "boneless beef short ribs"
                },
                {
                    "id": 5177,
                    "name": "turkey liver"
                },
                {
                    "id": 5662,
                    "name": "ground turkey"
                },
                {
                    "id": 99201,
                    "name": "bone in skin on turkey breast"
                },
                {
                    "id": 93672,
                    "name": "partridge"
                },
                {
                    "id": 10217158,
                    "name": "wild boar tenderloins"
                },
                {
                    "id": 99120,
                    "name": "crocodile meat"
                },
                {
                    "id": 7961,
                    "name": "sliced chicken breast"
                },
                {
                    "id": 1005096,
                    "name": "bone in skinless chicken thighs"
                },
                {
                    "id": 5011,
                    "name": "skinless chicken pieces"
                },
                {
                    "id": 13325,
                    "name": "beef liver"
                },
                {
                    "id": 99233,
                    "name": "chorizo"
                },
                {
                    "id": 99233,
                    "name": "spanish chorizo"
                },
                {
                    "id": 7925,
                    "name": "pastrami"
                },
                {
                    "id": 1017063,
                    "name": "sausage"
                },
                {
                    "id": 7036,
                    "name": "italian sausage"
                },
                {
                    "id": 17032,
                    "name": "lamb rib chops"
                },
                {
                    "id": 13874,
                    "name": "cube steak"
                },
                {
                    "id": 10023232,
                    "name": "ribeye steak"
                },
                {
                    "id": 1005062,
                    "name": "bone in chicken breast"
                },
                {
                    "id": 23079,
                    "name": "lean chuck steak"
                },
                {
                    "id": 7951,
                    "name": "scrapple"
                },
                {
                    "id": 5062,
                    "name": "chicken breast"
                },
                {
                    "id": 7052,
                    "name": "turkey pastrami"
                },
                {
                    "id": 17345,
                    "name": "venison loin"
                },
                {
                    "id": 23232,
                    "name": "steak"
                },
                {
                    "id": 99200,
                    "name": "boneless skinless turkey breast"
                },
                {
                    "id": 10204,
                    "name": "country style ribs"
                }
            ]
        },
        {
            "id": 10110219,
            "name": "meatballs",
            "image": "meatballs.png",
            "children": [
                {
                    "id": 99213,
                    "name": "turkey meatballs"
                }
            ]
        },
        {
            "id": 98865,
            "name": "meatloaf mix",
            "image": "meat-ground.jpg",
            "children": []
        },
        {
            "id": 22900,
            "name": "beef ravioli",
            "image": "ravioli.png",
            "children": []
        },
        {
            "id": 98971,
            "name": "veggie sausage",
            "image": "no.jpg",
            "children": [
                {
                    "id": 98972,
                    "name": "veggie sausage patties"
                }
            ]
        },
        {
            "id": 16542,
            "name": "veggie bacon",
            "image": "raw-bacon.png",
            "children": []
        },
        {
            "id": 16147,
            "name": "veggie burger",
            "image": "veggie-burger-patty.png",
            "children": []
        },
        {
            "id": 22120,
            "name": "veggie crumbles",
            "image": "soy-crumbles.jpg",
            "children": [
                {
                    "id": 98919,
                    "name": "quorn crumbles"
                }
            ]
        },
        {
            "id": 98968,
            "name": "veggie dogs",
            "image": "hotdogs.png",
            "children": []
        },
        {
            "id": 98981,
            "name": "veggie nuggets",
            "image": "no.jpg",
            "children": []
        },
        {
            "id": 98969,
            "name": "veggie meatballs",
            "image": "falafel.jpg",
            "children": []
        },
        {
            "id": 98972,
            "name": "veggie sausage patties",
            "image": "breakfast-sausage.png",
            "children": []
        },
        {
            "id": 10016542,
            "name": "vegetarian chicken deli slices",
            "image": "raw-bacon.png",
            "children": []
        },
        {
            "id": 17166,
            "name": "elk",
            "image": "beef-cubes-raw.png",
            "children": [
                {
                    "id": 10035177,
                    "name": "elk steak"
                },
                {
                    "id": 10017166,
                    "name": "elk tenderloin"
                },
                {
                    "id": 35177,
                    "name": "elk roast"
                },
                {
                    "id": 10017338,
                    "name": "elk sausage"
                },
                {
                    "id": 17338,
                    "name": "ground elk"
                }
            ]
        },
        {
            "id": 10015136,
            "name": "crabmeat",
            "image": "crabmeat.jpg",
            "children": [
                {
                    "id": 10115136,
                    "name": "lump crabmeat"
                },
                {
                    "id": 15141,
                    "name": "cooked crabmeat"
                }
            ]
        },
        {
            "id": 10023618,
            "name": "beef cubes",
            "image": "beef-cubes-raw.png",
            "children": []
        },
        {
            "id": 98877,
            "name": "hare",
            "image": "rabbit-pieces.png",
            "children": []
        },
        {
            "id": 17330,
            "name": "bison",
            "image": "fresh-ground-beef.jpg",
            "children": [
                {
                    "id": 17156,
                    "name": "bison roast"
                },
                {
                    "id": 17330,
                    "name": "ground bison"
                },
                {
                    "id": 17268,
                    "name": "bison ribeye"
                },
                {
                    "id": 17267,
                    "name": "bison strip loin"
                },
                {
                    "id": 93794,
                    "name": "bison back ribs"
                },
                {
                    "id": 17337,
                    "name": "bison steak"
                },
                {
                    "id": 10117267,
                    "name": "bison sirloin tip roast"
                },
                {
                    "id": 10017267,
                    "name": "bison tenderloin"
                },
                {
                    "id": 10017267,
                    "name": "bison sirloin"
                },
                {
                    "id": 93795,
                    "name": "bison short ribs"
                },
                {
                    "id": 10093795,
                    "name": "bone in bison short ribs"
                }
            ]
        },
        {
            "id": 15095,
            "name": "shark",
            "image": "raw-shark-steak.jpg",
            "children": []
        },
        {
            "id": 5167,
            "name": "turkey meat",
            "image": "turkey-raw-whole.jpg",
            "children": [
                {
                    "id": 5175,
                    "name": "turkey hearts"
                },
                {
                    "id": 5179,
                    "name": "turkey necks"
                },
                {
                    "id": 5173,
                    "name": "turkey gizzards"
                }
            ]
        },
        {
            "id": 10023572,
            "name": "ground chuck",
            "image": "fresh-ground-beef.jpg",
            "children": []
        },
        {
            "id": 17177,
            "name": "rabbit meat",
            "image": "rabbit-pieces.png",
            "children": []
        },
        {
            "id": 99213,
            "name": "turkey meatballs",
            "image": "meatballs.png",
            "children": []
        },
        {
            "id": 99013,
            "name": "turkey bratwurst",
            "image": "bratwurst.jpg",
            "children": []
        },
        {
            "id": 10115147,
            "name": "lobster meat",
            "image": "lobster.png",
            "children": []
        },
        {
            "id": 7063,
            "name": "ground pork sausage",
            "image": "meat-ground.jpg",
            "children": []
        },
        {
            "id": 10012104,
            "name": "coconut meat",
            "image": "coconut.jpg",
            "children": []
        },
        {
            "id": 99012,
            "name": "chicken bratwurst",
            "image": "bratwurst.jpg",
            "children": []
        },
        {
            "id": 7908,
            "name": "spam",
            "image": "spam.png",
            "children": []
        },
        {
            "id": 10115136,
            "name": "lump crabmeat",
            "image": "lump-crabmeat.png",
            "children": []
        },
        {
            "id": 17059,
            "name": "lamb stew meat",
            "image": "beef-cubes-raw.jpg",
            "children": []
        },
        {
            "id": 99120,
            "name": "crocodile meat",
            "image": "crocodile-meat.jpg",
            "children": []
        },
        {
            "id": 93735,
            "name": "imitation crab",
            "image": "crabmeat.jpg",
            "children": []
        },
        {
            "id": 10017158,
            "name": "wild boar stew meat",
            "image": "pork-cutlets.jpg",
            "children": []
        },
        {
            "id": 17338,
            "name": "ground elk",
            "image": "fresh-ground-beef.jpg",
            "children": []
        },
        {
            "id": 7259,
            "name": "deli turkey",
            "image": "deli-turkey.jpg",
            "children": [
                {
                    "id": 7081,
                    "name": "sliced turkey"
                }
            ]
        },
        {
            "id": 98982,
            "name": "veggie deli slices",
            "image": "veggie-deli-slices.jpg",
            "children": [
                {
                    "id": 10016542,
                    "name": "vegetarian chicken deli slices"
                }
            ]
        },
        {
            "id": 15141,
            "name": "cooked crabmeat",
            "image": "lump-crabmeat.png",
            "children": []
        },
        {
            "id": 1075062,
            "name": "chicken breast meat",
            "image": "chicken-breasts.png",
            "children": []
        },
        {
            "id": 5166,
            "name": "leftover turkey",
            "image": "cooked-turkey-meat.png",
            "children": []
        },
        {
            "id": 1005662,
            "name": "ground all white meat turkey",
            "image": "meat-ground.jpg",
            "children": []
        },
        {
            "id": 10093735,
            "name": "imitation lobster",
            "image": "no.jpg",
            "children": []
        },
        {
            "id": 23557,
            "name": "95 percent lean ground beef",
            "image": "fresh-ground-beef.jpg",
            "children": []
        },
        {
            "id": 5665,
            "name": "93 percent lean ground turkey",
            "image": "meat-ground.jpg",
            "children": []
        },
        {
            "id": 1005114,
            "name": "shredded chicken",
            "image": "rotisserie-chicken.png",
            "children": []
        },
        {
            "id": 23562,
            "name": "90 percent lean ground beef",
            "image": "fresh-ground-beef.jpg",
            "children": []
        },
        {
            "id": 93706,
            "name": "mincemeat",
            "image": "mincemeat.jpg",
            "children": []
        }
    ],
    "offset": 0,
    "number": 100,
    "totalResults": 47
};
const mockDataID = JSON.parse(`{
    "original": "turkey meat",
    "originalName": "turkey meat",
    "name": "turkey meat",
    "amount": 150.0,
    "unit": "grams",
    "unitShort": "g",
    "unitLong": "grams",
    "possibleUnits": [
        "slice",
        "bird",
        "g",
        "ounce",
        "oz",
        "cup",
        "serving"
    ],
    "estimatedCost": {
        "value": 76.33,
        "unit": "US Cents"
    },
    "consistency": "solid",
    "shoppingListUnits": [
        "ounces",
        "pounds"
    ],
    "aisle": "Meat",
    "image": "turkey-raw-whole.jpg",
    "meta": [],
    "nutrition": {
        "nutrients": [
            {
                "name": "Manganese",
                "amount": 0.02,
                "unit": "mg",
                "percentOfDailyNeeds": 0.9
            },
            {
                "name": "Calories",
                "amount": 168.0,
                "unit": "kcal",
                "percentOfDailyNeeds": 8.4
            },
            {
                "name": "Copper",
                "amount": 0.12,
                "unit": "mg",
                "percentOfDailyNeeds": 5.93
            },
            {
                "name": "Saturated Fat",
                "amount": 0.69,
                "unit": "g",
                "percentOfDailyNeeds": 4.3
            },
            {
                "name": "Magnesium",
                "amount": 40.5,
                "unit": "mg",
                "percentOfDailyNeeds": 10.13
            },
            {
                "name": "Sugar",
                "amount": 0.1,
                "unit": "g",
                "percentOfDailyNeeds": 0.12
            },
            {
                "name": "Vitamin E",
                "amount": 0.14,
                "unit": "mg",
                "percentOfDailyNeeds": 0.9
            },
            {
                "name": "Vitamin B2",
                "amount": 0.29,
                "unit": "mg",
                "percentOfDailyNeeds": 16.94
            },
            {
                "name": "Sodium",
                "amount": 177.0,
                "unit": "mg",
                "percentOfDailyNeeds": 7.7
            },
            {
                "name": "Mono Unsaturated Fat",
                "amount": 0.72,
                "unit": "g",
                "percentOfDailyNeeds": 0.0
            },
            {
                "name": "Vitamin B3",
                "amount": 12.15,
                "unit": "mg",
                "percentOfDailyNeeds": 60.75
            },
            {
                "name": "Lycopene",
                "amount": 0.0,
                "unit": "µg",
                "percentOfDailyNeeds": 0.0
            },
            {
                "name": "Vitamin D",
                "amount": 0.3,
                "unit": "µg",
                "percentOfDailyNeeds": 2.0
            },
            {
                "name": "Trans Fat",
                "amount": 0.01,
                "unit": "g",
                "percentOfDailyNeeds": 105.0
            },
            {
                "name": "Vitamin B1",
                "amount": 0.08,
                "unit": "mg",
                "percentOfDailyNeeds": 5.0
            },
            {
                "name": "Cholesterol",
                "amount": 100.5,
                "unit": "mg",
                "percentOfDailyNeeds": 33.5
            },
            {
                "name": "Vitamin B6",
                "amount": 0.98,
                "unit": "mg",
                "percentOfDailyNeeds": 48.9
            },
            {
                "name": "Phosphorus",
                "amount": 285.0,
                "unit": "mg",
                "percentOfDailyNeeds": 28.5
            },
            {
                "name": "Selenium",
                "amount": 33.9,
                "unit": "µg",
                "percentOfDailyNeeds": 48.43
            },
            {
                "name": "Folic Acid",
                "amount": 0.0,
                "unit": "µg",
                "percentOfDailyNeeds": 0.0
            },
            {
                "name": "Carbohydrates",
                "amount": 0.0,
                "unit": "g",
                "percentOfDailyNeeds": 0.0
            },
            {
                "name": "Poly Unsaturated Fat",
                "amount": 0.62,
                "unit": "g",
                "percentOfDailyNeeds": 0.0
            },
            {
                "name": "Vitamin K",
                "amount": 0.0,
                "unit": "µg",
                "percentOfDailyNeeds": 0.0
            },
            {
                "name": "Iron",
                "amount": 1.29,
                "unit": "mg",
                "percentOfDailyNeeds": 7.17
            },
            {
                "name": "Choline",
                "amount": 90.3,
                "unit": "mg",
                "percentOfDailyNeeds": 0.0
            },
            {
                "name": "Fiber",
                "amount": 0.0,
                "unit": "g",
                "percentOfDailyNeeds": 0.0
            },
            {
                "name": "Protein",
                "amount": 33.96,
                "unit": "g",
                "percentOfDailyNeeds": 67.92
            },
            {
                "name": "Calcium",
                "amount": 16.5,
                "unit": "mg",
                "percentOfDailyNeeds": 1.65
            },
            {
                "name": "Vitamin A",
                "amount": 45.0,
                "unit": "IU",
                "percentOfDailyNeeds": 0.9
            },
            {
                "name": "Vitamin B12",
                "amount": 1.86,
                "unit": "µg",
                "percentOfDailyNeeds": 31.0
            },
            {
                "name": "Fat",
                "amount": 2.89,
                "unit": "g",
                "percentOfDailyNeeds": 4.45
            },
            {
                "name": "Caffeine",
                "amount": 0.0,
                "unit": "mg",
                "percentOfDailyNeeds": 0.0
            },
            {
                "name": "Folate",
                "amount": 10.5,
                "unit": "µg",
                "percentOfDailyNeeds": 2.63
            },
            {
                "name": "Alcohol",
                "amount": 0.0,
                "unit": "g",
                "percentOfDailyNeeds": 0.0
            },
            {
                "name": "Potassium",
                "amount": 352.5,
                "unit": "mg",
                "percentOfDailyNeeds": 10.07
            },
            {
                "name": "Vitamin C",
                "amount": 0.0,
                "unit": "mg",
                "percentOfDailyNeeds": 0.0
            },
            {
                "name": "Net Carbohydrates",
                "amount": 0.0,
                "unit": "g",
                "percentOfDailyNeeds": 0.0
            },
            {
                "name": "Vitamin B5",
                "amount": 1.27,
                "unit": "mg",
                "percentOfDailyNeeds": 12.66
            },
            {
                "name": "Zinc",
                "amount": 2.76,
                "unit": "mg",
                "percentOfDailyNeeds": 18.4
            }
        ],
        "properties": [
            {
                "name": "Glycemic Index",
                "amount": 0.0,
                "unit": ""
            },
            {
                "name": "Glycemic Load",
                "amount": 0.0,
                "unit": ""
            },
            {
                "name": "Inflammation Score",
                "amount": 0.0,
                "unit": ""
            },
            {
                "name": "Nutrition Score",
                "amount": 13.602608695652172,
                "unit": "%"
            }
        ],
        "flavonoids": [
            {
                "name": "Cyanidin",
                "amount": 0.0,
                "unit": ""
            },
            {
                "name": "Petunidin",
                "amount": 0.0,
                "unit": ""
            },
            {
                "name": "Delphinidin",
                "amount": 0.0,
                "unit": ""
            },
            {
                "name": "Malvidin",
                "amount": 0.0,
                "unit": ""
            },
            {
                "name": "Pelargonidin",
                "amount": 0.0,
                "unit": ""
            },
            {
                "name": "Peonidin",
                "amount": 0.0,
                "unit": ""
            },
            {
                "name": "Catechin",
                "amount": 0.0,
                "unit": ""
            },
            {
                "name": "Epigallocatechin",
                "amount": 0.0,
                "unit": ""
            },
            {
                "name": "Epicatechin",
                "amount": 0.0,
                "unit": ""
            },
            {
                "name": "Epicatechin 3-gallate",
                "amount": 0.0,
                "unit": ""
            },
            {
                "name": "Epigallocatechin 3-gallate",
                "amount": 0.0,
                "unit": ""
            },
            {
                "name": "Theaflavin",
                "amount": 0.0,
                "unit": ""
            },
            {
                "name": "Thearubigins",
                "amount": 0.0,
                "unit": ""
            },
            {
                "name": "Eriodictyol",
                "amount": 0.0,
                "unit": ""
            },
            {
                "name": "Hesperetin",
                "amount": 0.0,
                "unit": ""
            },
            {
                "name": "Naringenin",
                "amount": 0.0,
                "unit": ""
            },
            {
                "name": "Apigenin",
                "amount": 0.0,
                "unit": ""
            },
            {
                "name": "Luteolin",
                "amount": 0.0,
                "unit": ""
            },
            {
                "name": "Isorhamnetin",
                "amount": 0.0,
                "unit": ""
            },
            {
                "name": "Kaempferol",
                "amount": 0.0,
                "unit": ""
            },
            {
                "name": "Myricetin",
                "amount": 0.0,
                "unit": ""
            },
            {
                "name": "Quercetin",
                "amount": 0.0,
                "unit": ""
            },
            {
                "name": "Theaflavin-3,3'-digallate",
                "amount": 0.0,
                "unit": ""
            },
            {
                "name": "Theaflavin-3'-gallate",
                "amount": 0.0,
                "unit": ""
            },
            {
                "name": "Theaflavin-3-gallate",
                "amount": 0.0,
                "unit": ""
            },
            {
                "name": "Gallocatechin",
                "amount": 0.0,
                "unit": ""
            }
        ],
        "caloricBreakdown": {
            "percentProtein": 83.91,
            "percentFat": 16.09,
            "percentCarbs": 0.0
        },
        "weightPerServing": {
            "amount": 150,
            "unit": "g"
        }
    },
    "categoryPath": [
        "turkey",
        "poultry",
        "meat"
    ]
}`);
export const baseCall = async (url: string, query: Record<string, any>, devAPIkey?: string) => {
    let SpoonacularTrack = await ApiTrack.findOne({ serviceName: 'Spoonacular' });
    if (!SpoonacularTrack) {
        SpoonacularTrack = new ApiTrack({ serviceName: 'Spoonacular', usageCount: 0, currentKey: 0, callPerMin: 0, updatedAt: new Date() });
    }
    let { usageCount, currentKey, callPerMin } = SpoonacularTrack;

    const maxCall = (process.env.spoonacular_max_call ? parseInt(process.env.spoonacular_max_call) : 130) - 1;
    const numberOfKey = (process.env.spoonacular_total_key ? parseInt(process.env.spoonacular_total_key) : 5);
    const rate = (process.env.spoonacular_rate ? parseInt(process.env.spoonacular_rate) : 50) - 1;

    if (SpoonacularTrack.updatedAt.getDay() != new Date().getDay()) {
        usageCount = 0;
        currentKey = 0;
    }
    if (Math.abs(Number(new Date().getTime()) - Number(SpoonacularTrack.updatedAt)) > 60000) {
        callPerMin = 0;
    }
    if (usageCount > maxCall && currentKey < numberOfKey) {
        currentKey++;
        usageCount = 0;
    }
    if (usageCount > maxCall && currentKey >= numberOfKey - 1) {
        throw new ServerError('API limit reached');
    }
    if (callPerMin > rate && Math.abs(Number(new Date().getTime()) - Number(SpoonacularTrack.updatedAt)) < 60000) {
        throw new ServerError('API rate limit reached');
    }
    SpoonacularTrack.usageCount = usageCount + 1;
    SpoonacularTrack.currentKey = currentKey;
    SpoonacularTrack.callPerMin = callPerMin + 1;
    await SpoonacularTrack.save();

    try {
        const params = new URLSearchParams({
            apiKey: `${arrKey[currentKey]}`,
            number: '100',
            ...query,
        });
        const response = await baseURL.get(url, { params });
        return response.data;

    } catch (error) {
        throw new ServerError(`${error}`);
    }
}

export const getAllIngredientsAPI = async (allergy: string[], diet: string[], query: string) => {

    return await baseCall(EndPoint.FIND_INGREDIENTS,
        {
            query: query,
            number: '100',
            addChildren: 'true',
        }
    );
};

export const getIngredientByIdAPI = async (id: string) => {

    return await baseCall(EndPoint.FIND_INGREDIENTS_BY_ID(id), {
        amount: '100',
        unit: 'grams',
    });
}

export const getAllMealsAPI = async (ingredients: string[]) => {
    return await baseCall(EndPoint.FIND_RECIPES_BY_INGREDIENTS, {
        ingredients: ingredients.join(','),
    });
}

export const addIngredient = async (cagetory: string, id: Number) => {
    const find = await Ingredients.findOne({ id: id });
    if (find) {
        return find;
    }
    else {
        const info = await getIngredientByIdAPI(`${id}`);
        const newIngredient = new Ingredients({ id: id, ...info, myCagetory: cagetory });
        await newIngredient.save();
        return newIngredient;
    }

}