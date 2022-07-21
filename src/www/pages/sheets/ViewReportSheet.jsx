import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { apiCall, getDateObject, reportVerbose } from '../../helpers';
import "./styles/ViewInvoiceSheet.css"
import "./styles/ViewReportSheet.css"
import { Col, Divider, Tag, Row, Button, Table, Skeleton, Segmented, Space, DatePicker, Result, Select } from 'antd';
import { useAuthHeader, useIsAuthenticated } from 'react-auth-kit';
import { AuditOutlined, BookOutlined, CloudDownloadOutlined, DownloadOutlined, LoadingOutlined, RollbackOutlined } from '@ant-design/icons';

const getSymbolFromCurrency = require('currency-symbol-map')
const hdate = require("human-date");
const { RangePicker } = DatePicker;
const { Option } = Select;



function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
}


const categories = {
    "Balance" : {
        1 : "balance.summary.1",
        2 : "balance_change_from_activity.summary.1",
        3 : "balance_change_from_activity.itemized.3",
        4 : "payouts.summary.1",
        5 : "payouts.itemized.3",
    },
    "Payout Reconciliation" : {
        6 : "balance.summary.1",
        7 : "payout_reconciliation.summary.1",
        8 : "payout_reconciliation.itemized.5",
        9 : "ending_balance_reconciliation.summary.1",
        10 : "ending_balance_reconciliation.itemized.4"
    }
}

const inv_categories = {
        "balance.summary.1" : 1,
        "balance_change_from_activity.summary.1" : 2,
        "balance_change_from_activity.itemized.3" : 3,
        "payouts.summary.1" : 4,
        "payouts.itemized.3" : 5,
        "balance.summary.1" : 6,
        "payout_reconciliation.summary.1" : 7,
        "payout_reconciliation.itemized.5" : 8,
        "ending_balance_reconciliation.summary.1" : 9,
         "ending_balance_reconciliation.itemized.4" : 1,
}

const fieldNames = {
    label : "title",
    value : "key",
}



const ViewReportSheet = () => {

    const authHeader = useAuthHeader();
    const navigate = useNavigate();

    
    const [dates, setDates] = useState([1642662478, 1658128249]);
    const [cols, setCols] = useState([]);

    const [domain, setDomain] = useState("Balance");
    const [current_page_status, setCurrent_page_status] = useState(false);

    const [balance_summary_1, set_balance_summary_1] = useState(false);
    const [balance_summary_1_cols, set_balance_summary_1_cols] = useState([]);
    
    
    const [balance_change_from_activity_type, set_balance_change_from_activity_type] = useState("summary");
    const [balance_change_from_activity_summary_1, set_balance_change_from_activity_summary_1] = useState(false);
    const [balance_change_from_activity_summary_1_cols, set_balance_change_from_activity_summary_1_cols] = useState([]);
    const [balance_change_from_activity_itemized_3, set_balance_change_from_activity_itemized_3] = useState(false);
    const [balance_change_from_activity_itemized_3_cols, set_balance_change_from_activity_itemized_3_cols] = useState([]);
    
    const [payouts_type, set_payouts_type] = useState("summary");
    const [payouts_summary_1, set_payouts_summary_1] = useState(false);
    const [payouts_summary_1_cols, set_payouts_summary_1_cols] = useState([]);
    const [payouts_itemized_3, set_payouts_itemized_3] = useState(false);
    const [payouts_itemized_3_cols, set_payouts_itemized_3_cols] = useState([]);

    
    const [payout_reconciliation_type, set_payout_reconciliation_type] = useState("summary");
    const [payout_reconciliation_summary_1, set_payout_reconciliation_summary_1] = useState(false);
    const [payout_reconciliation_summary_1_cols, set_payout_reconciliation_summary_1_cols] = useState([]);
    const [payout_reconciliation_itemized_5, set_payout_reconciliation_itemized_5] = useState(false);
    const [payout_reconciliation_itemized_5_cols, set_payout_reconciliation_itemized_5_cols] = useState([]);
    
    const [ending_balance_reconciliation_type, set_ending_balance_reconciliation_type] = useState("summary");
    const [ending_balance_reconciliation_summary_1, set_ending_balance_reconciliation_summary_1] = useState(false);
    const [ending_balance_reconciliation_summary_1_cols, set_ending_balance_reconciliation_summary_1_cols] = useState([]);
    const [ending_balance_reconciliation_itemized_4, set_ending_balance_reconciliation_itemized_4] = useState(false);
    const [ending_balance_reconciliation_itemized_4_cols, set_ending_balance_reconciliation_itemized_4_cols] = useState([]);


    const fetchSetReportStateCols = (report_type) => {
      switch (inv_categories[report_type]) {
          case 1:
              return set_balance_summary_1_cols;
              break;
              
          case 2:
              return set_balance_change_from_activity_summary_1_cols;
              break;
              
          case 3:
              return set_balance_change_from_activity_itemized_3_cols;
              break;
              
          case 4:
              return set_payouts_summary_1_cols;
              break;
              
          case 5:
              return set_payouts_itemized_3_cols;
              break;
              
          case 6:
              return set_balance_summary_1_cols;
              break;
              
          case 7:
              return set_payout_reconciliation_summary_1_cols;
              break;
              
          case 8:
              return set_payout_reconciliation_itemized_5_cols;
              break;
              
          case 9:
              return set_ending_balance_reconciliation_summary_1_cols;
              break;
              
          case 10:
              return set_ending_balance_reconciliation_itemized_4_cols;
              break;
              
        default:
              return console.log;
              break;
      }
    }

    const fetchSetReportState = (report_type) => {
      switch (inv_categories[report_type]) {
          case 1:
              return set_balance_summary_1;
              break;
              
          case 2:
              return set_balance_change_from_activity_summary_1;
              break;
              
          case 3:
              return set_balance_change_from_activity_itemized_3;
              break;
              
          case 4:
              return set_payouts_summary_1;
              break;
              
          case 5:
              return set_payouts_itemized_3;
              break;
              
          case 6:
              return set_balance_summary_1;
              break;
              
          case 7:
              return set_payout_reconciliation_summary_1;
              break;
              
          case 8:
              return set_payout_reconciliation_itemized_5;
              break;
              
          case 9:
              return set_ending_balance_reconciliation_summary_1;
              break;
              
          case 10:
              return set_ending_balance_reconciliation_itemized_4;
              break;
              
        default:
              return console.log;
              break;
      }
    }

    const downloadAndSetFileStateContents = (report) => {
        apiCall("/reports/file", {file_id : report.result.id}, (response) => {
            const data = response.data.data;
            const content = data.content;
            const link = data.link;
            
            // Create and set columns
    
            const cols = makeColumns(content);
            content.forEach((row, index) => {
                row.key = index
                if(row.category){
                    const str = row.category.replaceAll("_", " ");
                    row.category = toTitleCase(str);
                }
                if(row.reporting_category){
                    const str = row.reporting_category.replaceAll("_", " ");
                    row.reporting_category = toTitleCase(str);
                }
            });

            const reportStateObject = { content, link, cols };

            console.log(report.report_type, reportStateObject)

            fetchSetReportStateCols(report.report_type)(cols);
            fetchSetReportState(report.report_type)(reportStateObject);
            setCurrent_page_status('ready');
    
        }, authHeader(), null, navigate);
    }
    
    const makeColumns = (data) => {
        // Create and set columns
        let columns = [];
    
        for (const key in data[0]) {
            if (Object.hasOwnProperty.call(data[0], key)) {
    
                const curr = {
                    dataIndex : key,
                    key : key,
                    value : key
                };
                let title = key.replaceAll('_', ' ');
                curr.title = toTitleCase(title);
                columns.push(curr);
            }
        }
    
        return columns;
    }
    
    const createReportAndAwaitCompletion = (report_type) => {

        const apiCallObject = {
            report_type,
            parameters : {
                interval_end : dates[1]
            }
        }
        if(!report_type.startsWith("ending_balance_reconciliation")) apiCallObject.parameters.interval_start = dates[0]

        apiCall(
            "/reports/create",
            apiCallObject,
            (response) => {
            
            const report = response.data.data;
            const ah = authHeader();
            const token = ah.split(" ")[1];
            const url = `ws${window.location.hostname == "localhost" ? "" : "s"}://${window.location.hostname}${window.location.hostname == "localhost" ? ":4000" : ""}/?auth_token=${token}&report_id=${report.id}`
            
            const ws = new WebSocket(url);
    
            ws.addEventListener('open', function (event) {
                console.log(`[${report_type}] Websocket connected.`);
            })
    
            ws.addEventListener('message', function (event) {
                const msg = event.data;
                console.log(msg);
                console.log(JSON.parse(msg))
                const report = JSON.parse(msg);
                console.log("Websocket report : ",report_type, report);
                downloadAndSetFileStateContents(report);
                ws.close();
            });
            
        }, authHeader(), null, navigate);
    }
    
    const handleDomainChange = (option) => {
        setDomain(option);
    }
    
    const makeReport = () => {
        setCurrent_page_status("loading");

        // createReportAndAwaitCompletion("balance.summary.1");

        for (const i in categories[domain]) {
            if (Object.hasOwnProperty.call(categories[domain], i)) {
                const report_type_desc = categories[domain][i];
                console.log(report_type_desc)
                createReportAndAwaitCompletion(report_type_desc);
            }
        }
    }

    return (
        <div className='sheet main'>
            <Space>
            <Segmented options={["Balance", "Payout Reconciliation"]} onChange={handleDomainChange} />
            <RangePicker onChange={(moment_dates) => {
                if(moment_dates.length == 2) setDates([moment_dates[0].unix(), moment_dates[1].unix()]);
            }} />
            <Button icon={<AuditOutlined />} loading={current_page_status === "loading" } type='primary' onClick={makeReport} >Create Report</Button>
            </Space>
            <Divider />
            
            {!current_page_status && 
                <Result 
                    icon={<BookOutlined />}
                    title="Create a Report"
                />
            }

            {current_page_status === "loading" &&
            
            <Result 
                icon={<LoadingOutlined spin />}
                title="Generating Report..."
            />
            
            }

            {
                domain === "Balance" && 
                <>

                    {balance_summary_1 && 
                        <>
                            <h2>Balance Summary</h2>
                            <p>The Balance summary section shows your starting and ending Stripe balance for the selected date range, along with a high level summary of your activity during the period. Your balance includes funds that are available, pending, and any reserved funds, if applicable.</p>

                            <Row style={{marginBottom : "0.8em"}} justify="space-between">
                                <Col>
                                    <Select 
                                        mode="multiple" 
                                        options={balance_summary_1.cols} 
                                        onChange={(arr) => {
                                            const new_arr = balance_summary_1.cols.filter((el) => {
                                                return arr.includes(el.key)
                                            });
                                            set_balance_summary_1_cols(new_arr);
                                        }}
                                        defaultValue={() => {
                                            let cols = [];
                                            balance_summary_1_cols.forEach(c => cols.push(c.key));
                                            console.log(cols);
                                            return cols;
                                        }}
                                        placeholder="Select Columns" 
                                        showSearch 
                                        showArrow
                                        fieldNames={fieldNames}
                                    >
                                        Select Columns
                                    </Select>
                                </Col>
                                <Col>
                                    <Button target="_blank" disabled={!balance_summary_1.link} href={balance_summary_1 && balance_summary_1.link} icon={<DownloadOutlined />} type='primary' shape='round'>
                                        Download CSV
                                    </Button>
                                </Col>
                            </Row>

                            <Table pagination={false} dataSource={balance_summary_1.content} >
                                {balance_summary_1_cols && balance_summary_1_cols.map(col => <Option title={col.title} key={col.key} dataIndex={col.dataIndex} />)}
                            </Table>

                            <Divider />
                            
                        </>
                    }

                    {(balance_change_from_activity_summary_1 || balance_change_from_activity_itemized_3) && 
                        <>
                            <h2>
                                {/* Balance change from activity - {toTitleCase(balance_change_from_activity_type)} */}
                                Balance change from activity - 

                                <Select className='category-select' bordered={false} onChange={(val) => set_balance_change_from_activity_type(val)} value={balance_change_from_activity_type}>
                                    <Option value="summary">Summary</Option>
                                    <Option value="itemized">Itemized</Option>
                                </Select>

                            </h2>
                            <p>The Balance change from activity section provides a more detailed breakdown of your transactions by reporting category. This section includes all transactions except for payouts that affect your balance, including charges, refunds, disputes, other adjustments, and fees.</p>



                            {
                                balance_change_from_activity_type === "summary" ?
                                <>
                                    <Row style={{marginBottom : "0.8em"}} justify='space-between'>
                                        <Col>
                                            <Select 
                                                mode="multiple" 
                                                options={balance_change_from_activity_summary_1.cols} 
                                                onChange={(arr) => {
                                                    const new_arr = balance_change_from_activity_summary_1.cols.filter((el) => {
                                                        return arr.includes(el.key)
                                                    });
                                                    set_balance_change_from_activity_summary_1_cols(new_arr);
                                                }}
                                                defaultValue={() => {
                                                    let cols = [];
                                                    balance_change_from_activity_summary_1_cols.forEach(c => cols.push(c.key));
                                                    console.log(cols);
                                                    return cols;
                                                }}
                                                placeholder="Select Columns" 
                                                showSearch 
                                                showArrow
                                                fieldNames={fieldNames}
                                            >
                                                Select Columns 
                                            </Select>
                                        </Col>
                                        <Col>
                                        <Button target="_blank" disabled={!balance_change_from_activity_summary_1.link} href={balance_change_from_activity_summary_1 && balance_change_from_activity_summary_1.link} icon={<DownloadOutlined />} type='primary' shape='round'>
                                            Download CSV
                                        </Button>
                                        </Col>
                                    </Row>

                                    <Table pagination={false} dataSource={balance_change_from_activity_summary_1.content} >
                                        {balance_change_from_activity_summary_1_cols && balance_change_from_activity_summary_1_cols.map(col => <Option title={col.title} key={col.key} dataIndex={col.dataIndex} />)}
                                    </Table>

                                </>
                                :
                                <>

                                    <Row style={{marginBottom : "0.8em"}} justify='space-between'>
                                        <Col>
                                        <Select 
                                            mode="multiple" 
                                            options={balance_change_from_activity_itemized_3.cols} 
                                            onChange={(arr) => {
                                                const new_arr = balance_change_from_activity_itemized_3.cols.filter((el) => {
                                                    return arr.includes(el.key)
                                                });
                                                set_balance_change_from_activity_itemized_3_cols(new_arr);
                                            }}
                                            defaultValue={() => {
                                                let cols = [];
                                                balance_change_from_activity_itemized_3_cols.forEach(c => cols.push(c.key));
                                                console.log(cols);
                                                return cols;
                                            }}
                                            placeholder="Select Columns" 
                                            showSearch 
                                            showArrow
                                            fieldNames={fieldNames}
                                        >
                                            Select Columns 
                                        </Select>
                                        </Col>
                                        <Col>
                                        <Button target="_blank" disabled={!balance_change_from_activity_itemized_3.link} href={balance_change_from_activity_itemized_3 && balance_change_from_activity_itemized_3.link} icon={<DownloadOutlined />} type='primary' shape='round'>
                                            Download CSV
                                        </Button>
                                        </Col>
                                    </Row>

                                    <Table pagination={false} dataSource={balance_change_from_activity_itemized_3.content} >
                                        {balance_change_from_activity_itemized_3_cols && balance_change_from_activity_itemized_3_cols.map(col => <Option title={col.title} key={col.key} dataIndex={col.dataIndex} />)}
                                    </Table>

                                </>
                            }
                            
                            <Divider />
                        </>
                    }
                    {(payouts_summary_1 || payouts_itemized_3) && 
                        <>
                            <h2>    
                                Payouts - 

                                <Select className='category-select' bordered={false} onChange={(val) => set_payouts_type(val)} value={payouts_type}>
                                    <Option value="summary">Summary</Option>
                                    <Option value="itemized">Itemized</Option>
                                </Select>

                            </h2>
                            <p>The Payouts section provides the quantity and total amount of payouts to your bank account during the period. You can download a list of individual payout transactions by clicking the Download button.</p>



                            {
                                payouts_type === "summary" ?
                                <>
                                    <Row style={{marginBottom : "0.8em"}} justify='space-between'>
                                        <Col>
                                            <Select 
                                                mode="multiple" 
                                                options={payouts_summary_1.cols} 
                                                onChange={(arr) => {
                                                    const new_arr = payouts_summary_1.cols.filter((el) => {
                                                        return arr.includes(el.key)
                                                    });
                                                    set_payouts_summary_1_cols(new_arr);
                                                }}
                                                defaultValue={() => {
                                                    let cols = [];
                                                    payouts_summary_1_cols.forEach(c => cols.push(c.key));
                                                    console.log(cols);
                                                    return cols;
                                                }}
                                                placeholder="Select Columns" 
                                                showSearch 
                                                showArrow
                                                fieldNames={fieldNames}
                                            >
                                                Select Columns 
                                            </Select>
                                        </Col>
                                        <Col>
                                        <Button target="_blank" disabled={!payouts_summary_1.link} href={payouts_summary_1 && payouts_summary_1.link} icon={<DownloadOutlined />} type='primary' shape='round'>
                                            Download CSV
                                        </Button>
                                        </Col>
                                    </Row>

                                    <Table pagination={false} dataSource={payouts_summary_1.content} >
                                        {payouts_summary_1_cols && payouts_summary_1_cols.map(col => <Option title={col.title} key={col.key} dataIndex={col.dataIndex} />)}
                                    </Table>

                                </>
                                :
                                <>

                                    <Row style={{marginBottom : "0.8em"}} justify='space-between'>
                                        <Col>
                                        <Select 
                                            mode="multiple" 
                                            options={payouts_itemized_3.cols} 
                                            onChange={(arr) => {
                                                const new_arr = payouts_itemized_3.cols.filter((el) => {
                                                    return arr.includes(el.key)
                                                });
                                                set_payouts_itemized_3_cols(new_arr);
                                            }}
                                            defaultValue={() => {
                                                let cols = [];
                                                payouts_itemized_3_cols.forEach(c => cols.push(c.key));
                                                console.log(cols);
                                                return cols;
                                            }}
                                            placeholder="Select Columns" 
                                            showSearch 
                                            showArrow
                                            fieldNames={fieldNames}
                                        >
                                            Select Columns 
                                        </Select>
                                        </Col>
                                        <Col>
                                        <Button target="_blank" disabled={!payouts_itemized_3.link} href={payouts_itemized_3 && payouts_itemized_3.link} icon={<DownloadOutlined />} type='primary' shape='round'>
                                            Download CSV
                                        </Button>
                                        </Col>
                                    </Row>

                                    <Table pagination={false} dataSource={payouts_itemized_3.content} >
                                        {payouts_itemized_3_cols && payouts_itemized_3_cols.map(col => <Option title={col.title} key={col.key} dataIndex={col.dataIndex} />)}
                                    </Table>

                                </>
                            }
                            
                            <Divider />
                        </>
                    }

                </>
            }

            {
                domain == "Payout Reconciliation" &&
                <>

                    {balance_summary_1 && 
                        <>
                            <h2>Balance Summary</h2>
                            <p>The Balance summary section shows your starting and ending Stripe balance for the selected date range, along with a high level summary of your activity during the period. Your balance includes funds that are available, pending, and any reserved funds, if applicable.</p>

                            <Row style={{marginBottom : "0.8em"}} justify="space-between">
                                <Col>
                                    <Select 
                                        mode="multiple" 
                                        options={balance_summary_1.cols} 
                                        onChange={(arr) => {
                                            const new_arr = balance_summary_1.cols.filter((el) => {
                                                return arr.includes(el.key)
                                            });
                                            set_balance_summary_1_cols(new_arr);
                                        }}
                                        defaultValue={() => {
                                            let cols = [];
                                            balance_summary_1_cols.forEach(c => cols.push(c.key));
                                            console.log(cols);
                                            return cols;
                                        }}
                                        placeholder="Select Columns" 
                                        showSearch 
                                        showArrow
                                        fieldNames={fieldNames}
                                    >
                                        Select Columns
                                    </Select>
                                </Col>
                                <Col>
                                    <Button target="_blank" disabled={!balance_summary_1.link} href={balance_summary_1 && balance_summary_1.link} icon={<DownloadOutlined />} type='primary' shape='round'>
                                        Download CSV
                                    </Button>
                                </Col>
                            </Row>

                            <Table pagination={false} dataSource={balance_summary_1.content} >
                                {balance_summary_1_cols && balance_summary_1_cols.map(col => <Option title={col.title} key={col.key} dataIndex={col.dataIndex} />)}
                            </Table>

                            <Divider />
                            
                        </>
                    }

                    {(payout_reconciliation_summary_1 || payout_reconciliation_itemized_5) && 
                        <>
                            <h2>
                                Payout Reconciliation - 

                                <Select className='category-select' bordered={false} onChange={(val) => set_payout_reconciliation_type(val)} value={balance_change_from_activity_type}>
                                    <Option value="summary">Summary</Option>
                                    <Option value="itemized">Itemized</Option>
                                </Select>

                            </h2>
                            <p>The Payout reconciliation section provides a breakdown of the automatic payouts that were received in your bank account during the selected date range. The transactions included in those settlement batches are grouped by reporting category.</p>



                            {
                                payout_reconciliation_type === "summary" ?
                                <>
                                    <Row style={{marginBottom : "0.8em"}} justify='space-between'>
                                        <Col>
                                            <Select 
                                                mode="multiple" 
                                                options={payout_reconciliation_summary_1.cols} 
                                                onChange={(arr) => {
                                                    const new_arr = payout_reconciliation_summary_1.cols.filter((el) => {
                                                        return arr.includes(el.key)
                                                    });
                                                    set_payout_reconciliation_summary_1_cols(new_arr);
                                                }}
                                                defaultValue={() => {
                                                    let cols = [];
                                                    payout_reconciliation_summary_1_cols.forEach(c => cols.push(c.key));
                                                    console.log(cols);
                                                    return cols;
                                                }}
                                                placeholder="Select Columns" 
                                                showSearch 
                                                showArrow
                                                fieldNames={fieldNames}
                                            >
                                                Select Columns 
                                            </Select>
                                        </Col>
                                        <Col>
                                        <Button target="_blank" disabled={!payout_reconciliation_summary_1.link} href={payout_reconciliation_summary_1 && payout_reconciliation_summary_1.link} icon={<DownloadOutlined />} type='primary' shape='round'>
                                            Download CSV
                                        </Button>
                                        </Col>
                                    </Row>

                                    <Table pagination={false} dataSource={payout_reconciliation_summary_1.content} >
                                        {payout_reconciliation_summary_1_cols && payout_reconciliation_summary_1_cols.map(col => <Option title={col.title} key={col.key} dataIndex={col.dataIndex} />)}
                                    </Table>

                                </>
                                :
                                <>

                                    <Row style={{marginBottom : "0.8em"}} justify='space-between'>
                                        <Col>
                                        <Select 
                                            mode="multiple" 
                                            options={payout_reconciliation_itemized_5.cols} 
                                            onChange={(arr) => {
                                                const new_arr = payout_reconciliation_itemized_5.cols.filter((el) => {
                                                    return arr.includes(el.key)
                                                });
                                                set_payout_reconciliation_itemized_5_cols(new_arr);
                                            }}
                                            defaultValue={() => {
                                                let cols = [];
                                                payout_reconciliation_itemized_5_cols.forEach(c => cols.push(c.key));
                                                console.log(cols);
                                                return cols;
                                            }}
                                            placeholder="Select Columns" 
                                            showSearch 
                                            showArrow
                                            fieldNames={fieldNames}
                                        >
                                            Select Columns 
                                        </Select>
                                        </Col>
                                        <Col>
                                        <Button target="_blank" disabled={!payout_reconciliation_itemized_5.link} href={payout_reconciliation_itemized_5 && payout_reconciliation_itemized_5.link} icon={<DownloadOutlined />} type='primary' shape='round'>
                                            Download CSV
                                        </Button>
                                        </Col>
                                    </Row>

                                    <Table pagination={false} dataSource={payout_reconciliation_itemized_5.content} >
                                        {payout_reconciliation_itemized_5_cols && payout_reconciliation_itemized_5_cols.map(col => <Option title={col.title} key={col.key} dataIndex={col.dataIndex} />)}
                                    </Table>

                                </>
                            }
                            
                            <Divider />
                        </>
                    }
                    {(ending_balance_reconciliation_summary_1 || ending_balance_reconciliation_itemized_4) && 
                        <>
                            <h2>    
                                Ending Balance Reconciliation - 

                                <Select className='category-select' bordered={false} onChange={(val) => set_ending_balance_reconciliation_type(val)} value={payouts_type}>
                                    <Option value="summary">Summary</Option>
                                    <Option value="itemized">Itemized</Option>
                                </Select>

                            </h2>
                            <p>The Ending balance reconciliation section provides a similar breakdown of the transactions that hadn’t been settled as of the report’s end date.</p>



                            {
                                payouts_type === "summary" ?
                                <>
                                    <Row style={{marginBottom : "0.8em"}} justify='space-between'>
                                        <Col>
                                            <Select 
                                                mode="multiple" 
                                                options={ending_balance_reconciliation_summary_1.cols} 
                                                onChange={(arr) => {
                                                    const new_arr = ending_balance_reconciliation_summary_1.cols.filter((el) => {
                                                        return arr.includes(el.key)
                                                    });
                                                    set_ending_balance_reconciliation_summary_1_cols(new_arr);
                                                }}
                                                defaultValue={() => {
                                                    let cols = [];
                                                    ending_balance_reconciliation_summary_1_cols.forEach(c => cols.push(c.key));
                                                    return cols;
                                                }}
                                                placeholder="Select Columns" 
                                                showSearch 
                                                showArrow
                                                fieldNames={fieldNames}
                                            >
                                                Select Columns 
                                            </Select>
                                        </Col>
                                        <Col>
                                        <Button target="_blank" disabled={!ending_balance_reconciliation_summary_1.link} href={ending_balance_reconciliation_summary_1 && ending_balance_reconciliation_summary_1.link} icon={<DownloadOutlined />} type='primary' shape='round'>
                                            Download CSV
                                        </Button>
                                        </Col>
                                    </Row>

                                    <Table pagination={false} dataSource={ending_balance_reconciliation_summary_1.content} >
                                        {ending_balance_reconciliation_summary_1_cols && ending_balance_reconciliation_summary_1_cols.map(col => <Option title={col.title} key={col.key} dataIndex={col.dataIndex} />)}
                                    </Table>

                                </>
                                :
                                <>

                                    <Row style={{marginBottom : "0.8em"}} justify='space-between'>
                                        <Col>
                                        <Select 
                                            mode="multiple" 
                                            options={ending_balance_reconciliation_itemized_4.cols} 
                                            onChange={(arr) => {
                                                const new_arr = ending_balance_reconciliation_itemized_4.cols.filter((el) => {
                                                    return arr.includes(el.key)
                                                });
                                                set_ending_balance_reconciliation_itemized_4_cols(new_arr);
                                            }}
                                            defaultValue={() => {
                                                let cols = [];
                                                ending_balance_reconciliation_itemized_4_cols.forEach(c => cols.push(c.key));
                                                console.log(cols);
                                                return cols;
                                            }}
                                            placeholder="Select Columns" 
                                            showSearch 
                                            showArrow
                                            fieldNames={fieldNames}
                                        >
                                            Select Columns 
                                        </Select>
                                        </Col>
                                        <Col>
                                        <Button target="_blank" disabled={!ending_balance_reconciliation_itemized_4.link} href={ending_balance_reconciliation_itemized_4 && ending_balance_reconciliation_itemized_4.link} icon={<DownloadOutlined />} type='primary' shape='round'>
                                            Download CSV
                                        </Button>
                                        </Col>
                                    </Row>

                                    <Table pagination={false} dataSource={ending_balance_reconciliation_itemized_4.content} >
                                        {ending_balance_reconciliation_itemized_4_cols && ending_balance_reconciliation_itemized_4_cols.map(col => <Option title={col.title} key={col.key} dataIndex={col.dataIndex} />)}
                                    </Table>

                                </>
                            }
                            
                            <Divider />
                        </>
                    }

                </>
            }


        </div>
    )
}



export default ViewReportSheet;