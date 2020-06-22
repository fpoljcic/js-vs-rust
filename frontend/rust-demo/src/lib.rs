extern crate js_sys;
extern crate wasm_bindgen;

use js_sys::Array;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn fibonacci(param: u16) -> u32 {
    fibon(param)
}

fn fibon(num: u16) -> u32 {
    if num <= 1 {
        1
    } else {
        fibon(num - 1) + fibon(num - 2)
    }
}

#[wasm_bindgen]
#[allow(non_snake_case)]
pub fn wordsFilter(words: &JsValue) -> Array {
    let mut elements: Vec<String> = words.into_serde().unwrap();
    elements.sort_by(|a, b| b.cmp(&a));
    elements.retain(|a| {
        !a.contains("a")
            && !a.contains("e")
            && !a.contains("i")
            && !a.contains("o")
            && !a.contains("u")
            && a.len() > 6
    });

    elements.into_iter().map(JsValue::from).collect()
}

#[wasm_bindgen]
pub fn count() -> u32 {
    let mut res: u32 = 0;
    for _i in 0..50000000 {
        for _j in 0..1000000000 {
            res = res + 1;
        }
        for _j in 0..1000000000 {
            res = res - 1;
        }
    }
    res
}

#[wasm_bindgen]
#[allow(non_snake_case)]
pub fn countPrimes() -> u32 {
    let mut count: u32 = 0;
    for i in 0..1000000 {
        if isPrime(&i) {
            count = count + 1;
        }
    }
    count
}

#[allow(non_snake_case)]
pub fn isPrime(num: &u32) -> bool {
    let limit = ((*num as f32).sqrt() + 1.0) as u32;
    for i in 2..limit {
        if *num % i == 0 {
            return false;
        }
    }
    *num > 1
}
