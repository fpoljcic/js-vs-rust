import React from "react";
import ReactExport from "react-data-export";
import { Button, Space } from "antd";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const DownloadExcel = (props) => {
    return (
        <ExcelFile filename={props.filename} element={(
            <Space>
                <Button style={{ width: 250 }} size="large" type="primary">
                    Export excel file (JavaScript)
                </Button>
            </Space>
        )}>
            <ExcelSheet data={props.data} name="Report">
                <ExcelColumn label="id" value="id" />
                <ExcelColumn label="guid" value="guid" />
                <ExcelColumn label="balance" value="balance" />
                <ExcelColumn label="eyeColor" value="eyeColor" />
                <ExcelColumn label="name" value="name" />
                <ExcelColumn label="gender" value="gender" />
                <ExcelColumn label="company" value="company" />
                <ExcelColumn label="email" value="email" />
                <ExcelColumn label="phone" value="phone" />
                <ExcelColumn label="address" value="address" />
                <ExcelColumn label="about" value="about" />
            </ExcelSheet>
        </ExcelFile>
    );
}

export default DownloadExcel;