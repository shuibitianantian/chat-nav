import {
  ConfigProvider,
  Empty,
  Input,
  Space,
  Tag,
  Typography
} from "@arco-design/web-react"
import enUS from "@arco-design/web-react/es/locale/en-US"
import { IconLoading } from "@arco-design/web-react/icon"
import { useEffect, useMemo, useState } from "react"

import { MessageType, type QuestionElement } from "~typing"

import "@arco-design/web-react/dist/css/arco.css"
import "./styles.css"

const handleQuestionClick = async (id: string) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0].id) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { name: MessageType.SCROLL_TO_QUESTION, id },
        (response) => {
          console.log("Questions", response)
        }
      )
    }
  })
}

const sendGetQuestionsToContentScript = (callback) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0].id) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { name: MessageType.GET_QUESTIONS },
        (response) => {
          if (response?.questions) {
            callback(response.questions)
          }
        }
      )
    }
  })
}

function IndexPopup() {
  const [search, setSearch] = useState("")
  const [elements, setElements] = useState<QuestionElement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [clicked, setClicked] = useState<string>()

  useEffect(() => {
    const interval = setInterval(() => {
      sendGetQuestionsToContentScript((res) => {
        setElements(res)
        setIsLoading(false)
      })
    }, 300)
    return () => clearInterval(interval)
  }, [])

  const filteredElements = useMemo(() => {
    return elements.filter((ele) =>
      ele.text.toLowerCase().includes(search.toLowerCase())
    )
  }, [search, elements])

  return (
    <ConfigProvider locale={enUS}>
      <div
        style={{
          padding: "0px 16px 8px 16px",
          width: 500
        }}>
        <Typography.Title heading={4}>Questions</Typography.Title>
        <Input
          placeholder="search your questions"
          value={search}
          onChange={setSearch}
          style={{ marginBottom: 18 }}
        />
        {isLoading && (
          <IconLoading
            style={{ color: "rgb(var(--arcoblue-6))" }}
            fontSize={24}
          />
        )}
        {filteredElements.length === 0 && !isLoading ? (
          <Empty
            description="No question found"
            style={{
              padding: "32px 0px"
            }}
          />
        ) : (
          <Space direction="vertical">
            {filteredElements.map((ele, idx) => (
              <Space style={{ alignItems: "start" }}>
                <Tag color="arcoblue" bordered>
                  No.{idx}
                </Tag>
                <Typography.Text
                  key={ele.id}
                  ellipsis={{
                    rows: 3,
                    expandable: true,
                    onExpand(_, e) {
                      e.stopPropagation()
                    }
                  }}
                  className="customized-content"
                  onClick={() => {
                    handleQuestionClick(ele.id)
                    setClicked(ele.id)
                  }}
                  bold={ele.id === clicked}
                  style={{
                    cursor: "pointer",
                    margin: 0,
                    color: ele.id === clicked ? "rgb(var(--arcoblue-6))" : ""
                  }}>
                  {ele.text}
                </Typography.Text>
              </Space>
            ))}
          </Space>
        )}
      </div>
    </ConfigProvider>
  )
}

export default IndexPopup
