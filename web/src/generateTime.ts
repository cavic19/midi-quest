import { MAX_TIME } from "./config";

function generateTime(score: number): number {
    /*
    Standard linear function of t (time) and s (score)
    We want the MAX_TIME to slowly decreast to MIN_TIME over MAX_SCORE
    t = (MIN_TIME - MAX_TIME) / MAX_SCORE * s + MAX_TIME
  
    if score > MAX_SCORE return MIN_TIME
    */
    const MIN_TIME = 500
    const MAX_SCORE = 100
    if (score >= MAX_SCORE) {
      return MIN_TIME
    } else {
      return (MIN_TIME - MAX_TIME) / MAX_SCORE * score + MAX_TIME
    }
  }
  
  export default generateTime;