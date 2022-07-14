import React from "react";
import PageHeader from "antd/lib/page-header";
import "./PageHeader.css"
export default function PageHeaderLayout({footer, extra, onBack, title, subTitle, style}) {
    return(
        <PageHeader
            className="site-page-header"
            onBack={onBack}
            title={title}
            subTitle={subTitle}
            extra={[extra]}
            footer={footer}
            style={{...style}}
        ></PageHeader>
    );
}