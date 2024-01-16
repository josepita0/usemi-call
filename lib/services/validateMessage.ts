import axios, { AxiosResponse } from "axios"
import * as toxicity from "@tensorflow-models/toxicity";
import { showToast } from "../showToast";

export const objMatch:{
    [key:string]: string
} = {
    identity_attack: "El mensaje contiene ataques hacia alguna persona" ,
    insult:  "El mensaje contiene un insulto",
    obscene: "El mensaje contiene una obscenidad",
    severe_toxicity: "El mensaje es severamente tóxico",
    sexual_explicit: "El mensaje contiene contido sexual explícito",
    toxicity: "El mensaje contiene contido tóxico",
}

export const translateText = (sourceText:string): Promise<AxiosResponse<any>> => {

    return (
        new Promise( (resolve, rejected) => {
            try {
                const response = axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(sourceText)}&langpair=es|en`);                
                resolve(response)                
        
              } catch (error) {
                rejected(error)
                console.error('Error translating text:', error);
              }

        })
    )
}

export const classifyToxicity = async (threshold:number, sentence:string) => {

    const model = await toxicity.load(threshold, ["identity_attack", "insult", "obscene", "severe_toxicity", "sexual_explicit", "threat", "toxicity"]);    
    const pred = await model.classify(sentence);
    return pred
    
  }