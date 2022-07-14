import React from "react";
import Row from "antd/lib/row";
import ReactMarkdown from "react-markdown";
import './style.css';
import logo from "@assets/images/logo.png";
import login from "@assets/docs/Login.png";
import create_account from "@assets/docs/create_account.png";
import register from "@assets/docs/register.png";
import step1 from "@assets/docs/step1.png";
import step2 from "@assets/docs/step2.png";
import step3_1 from "@assets/docs/step3-1.png";
import step3_2 from "@assets/docs/step3-2.png";
import step4 from "@assets/docs/step4.png";
import step5 from "@assets/docs/step5.png";
import step6 from "@assets/docs/step6.png";
import start_label from "@assets/docs/start-label.png";
import queue_list_1 from "@assets/docs/queue-list-1.png";
import queue_list_2 from "@assets/docs/queue-list-2.png";
import hotkey from "@assets/docs/hotkey.png";
import hotkey_review from "@assets/docs/hotkey-review.png";
import review from "@assets/docs/review.png";
import queue_list_review_1 from "@assets/docs/queue-list-review-1.png";
import queue_list_review_2 from "@assets/docs/queue-list-review-2.png";
import dataset from "@assets/docs/dataset-list.png";
import dataset_detail from "@assets/docs/dataset-detail.png";
import create_dataset_1 from "@assets/docs/create-dataset.png";
import create_dataset_2 from "@assets/docs/create-dataset-2.png";
import create_dataset_3 from "@assets/docs/create-dataset-3.png";
import list_member from "@assets/docs/list-member.png";

const DocPage = () => {

  const markdown = `
  
  ![](${logo})

  # USER GUIDE
  
  ## [Back to home](/) 👈

  ## Authorization

  * First of all, you have to log in to \`TRA DA\` tool.

    ![](${login})

  * For register a new user press "Create an account"

    ![](${create_account})

  * If you want to create a non-admin account, you can do that using the link below on the login page. Don't forget to modify permissions for
    the new user in the administration panel. There are several groups (aka roles): admin, user, annotator, observer.

    ![](${register})

  ## Project
  ### Create new project
  
  To create project, you must pass through 5 step
  
  1.  **Create information**

      ![](${step1})

  2.  **Adding dataset**

      ![](${step2})
  
  3.  **Create editor**

  *  Click setup

      ![](${step3_1})
  
  *  Click "Add object" or "Add classification" to add tool

      ![](${step3_2})
  
  4.  **Select setting**

      ![](${step4})
  
  5.  **Adding member**

      ![](${step5})
  
  6.  **Finish**

      ![](${step6})
  
  ### Overview
    
  ### label
  
  ### Performance
    
  ### Export
  
  ### Setting
  
  ### Workspace
  
  1.  Labeling item

  *  you can choose tool to labeling work item from sidebar TOOLS

      ![](${start_label})

  2.  List item

  *  you can view list item and status in tab drawer

      ![](${queue_list_1}) 👉 ![](${queue_list_2})

  3.  Skip and submit work item

  *  you can submit and skip item by click button Skip or Submit
  
      *   Submit: You can submit after label work item

      *   Skip: You can skip work item but you will get it back if admin reject it

  4.  Hot key
    
  *  you can use hot key to fast labeling

      ![](${hotkey})
  
  ### Reviewing
  
  1.  Reviewing work item

  *  you can select item in sidebar and click icon like or dislike to review

      ![](${review})

  2.  List item

  *  you can view list work item and status in tab drawer

      ![](${queue_list_review_1})    ![](${queue_list_review_2})

  3.  Submit item

  *  you can submit item by click button Submit
  
  4.  Hot key
    
  *  you can use hot key to fast reviewing

      ![](${hotkey_review})

  ## Dataset

  1.  List dataset ( for admin )

  *  you can view list dataset in tab dataset in homepage

      ![](${dataset})

  2.  detail
  *  you can click to item in list dataset to redirect to detail page

      ![](${dataset_detail})
  
  3.  Create dataset
    
  *  you can click to "New Dataset" in tab list dataset to create new dataset and you must pass through 3 step

      * Step1 : create name for dataset

          ![](${create_dataset_1})

      * Step2 : upload item for dataset

          ![](${create_dataset_2})

      * step3 : finish create

          ![](${create_dataset_3})

  ## Member

  ### List member (for admin)

  You can click tab member in hompage to view list member

  ![](${list_member})

  
`

  return (
    <Row
      justify="start"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        padding: "100px",
        backgroundColor: "white",
      }}
    >
      <ReactMarkdown className="markdown-body">
        {markdown}
      </ReactMarkdown>
    </Row>
  );
};

export default DocPage;
