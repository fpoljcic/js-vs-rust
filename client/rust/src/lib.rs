mod utils;

//extern crate serde_json;
extern crate wasm_bindgen;
extern crate js_sys;

use wasm_bindgen::prelude::*;
use js_sys::Array;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, rust-helper!");
}

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
pub fn words_test(words: &JsValue) -> Array {
    let mut elements: Vec<String> = words.into_serde().unwrap();
    
    elements.sort_by(|a, b| b.cmp(&a));
    elements.retain(|a| !a.contains("a") && !a.contains("e") && !a.contains("i") && !a.contains("o") && !a.contains("u") && a.len() > 6);

    elements.into_iter().map(JsValue::from).collect()
}

#[wasm_bindgen]
pub fn valid_word(words: &JsValue, word: String) -> usize {
    let mut elements: Vec<String> = words.into_serde().unwrap();
    elements.retain(|a| a.contains(&word));
    elements.len()
}

#[wasm_bindgen]
pub fn concat_strings(words: &JsValue) -> String {
    let elements: Vec<String> = words.into_serde().unwrap();
    elements.join("")
}