mod utils;

use wasm_bindgen::prelude::*;

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
    alert("Hello, rust-test-new!");
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
