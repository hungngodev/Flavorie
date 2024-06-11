export type OptionType = {
    label: string;
    value: any;
  }
  
  export interface OptionMenuType {
    label: string;
    options: OptionType[];
  }
function parseOption(options: string[]){
    return options.map(option => ({label: option, value: option}))
}

export default parseOption
