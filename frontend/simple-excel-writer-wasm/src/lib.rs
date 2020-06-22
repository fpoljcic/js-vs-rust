extern crate zip;

pub use sheet::*;
pub use workbook::*;

pub mod sheet;
pub mod workbook;

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {}
}

// My code

extern crate wasm_bindgen;

pub use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[allow(non_snake_case)]
#[allow(unused_must_use)]
pub fn generateExcel(sheetName: String, headerValues: &JsValue, dataValues: &JsValue) -> Vec<u8> {
    let data: Vec<Vec<String>> = dataValues.into_serde().unwrap();
    let header: Vec<String> = headerValues.into_serde().unwrap();
    let mut wb = Workbook::create_in_memory();

    let mut sheet = wb.create_sheet(&sheetName);

    for e in header.iter() {
        sheet.add_column(Column {
            width: (e.len() + 5) as f32,
        });
    }

    wb.write_sheet(&mut sheet, |sheet_writer| {
        let sw = sheet_writer;

        let mut headerRow = Row::new();

        for e in header {
            headerRow.add_cell(e);
        }

        sw.append_row(headerRow);

        for dRow in data {
            let mut dataRow = Row::new();

            for e in dRow {
                dataRow.add_cell(e);
            }

            sw.append_row(dataRow);
        }

        Ok(())
    });
    wb.close().ok().unwrap().unwrap()
}

#[macro_use]
extern crate serde_derive;

#[derive(Serialize, Deserialize)]
#[allow(non_snake_case)]
pub struct TestStruct {
    id: String,
    guid: String,
    balance: String,
    eyeColor: String,
    name: String,
    gender: String,
    company: String,
    email: String,
    phone: String,
    address: String,
    about: String
}

#[wasm_bindgen]
#[allow(non_snake_case)]
#[allow(unused_must_use)]
pub fn excelTest(data: &JsValue) -> Vec<u8> {
    let data: Vec<TestStruct> = data.into_serde().unwrap();

    let mut wb = Workbook::create_in_memory();

    let mut sheet = wb.create_sheet("Report");

    wb.write_sheet(&mut sheet, |sheet_writer| {
        let sw = sheet_writer;

        sw.append_row(row![
            "id", "guid", "balance", "eyeColor", "name", "gender", "company", "email", "phone",
            "address", "about"
        ]);

        for e in data {
            sw.append_row(row![
                e.id, e.guid, e.balance, e.eyeColor, e.name, e.gender, e.company, e.email, e.phone,
                e.address, e.about
            ]);
        }

        Ok(())
    });

    wb.close().ok().unwrap().unwrap()
}
