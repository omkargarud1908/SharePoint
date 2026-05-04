import * as React from 'react';
import { useMemo, useRef, useState } from 'react';
import {
  DefaultButton,
  Icon,
  IconButton,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  TextField
} from '@fluentui/react';
import type { IChatBotProps } from './IChatBotProps';

type ChatRole = 'user' | 'assistant';

interface IChatMessage {
  id: number;
  role: ChatRole;
  content: string;
}

const starterPrompts: string[] = [
  'How do I request access to a SharePoint site?',
  'Help me troubleshoot document upload issues.',
  'How can I create a support ticket?'
];

const styles: { [key: string]: string } = {
  chatShell: 'chatShell',
  header: 'header',
  headerIcon: 'headerIcon',
  headerCopy: 'headerCopy',
  clearButton: 'clearButton',
  promptRow: 'promptRow',
  promptButton: 'promptButton',
  errorBar: 'errorBar',
  messages: 'messages',
  messageRow: 'messageRow',
  assistantMessageRow: 'assistantMessageRow',
  userMessageRow: 'userMessageRow',
  messageBubble: 'messageBubble',
  userBubble: 'userBubble',
  assistantBubble: 'assistantBubble',
  loadingBubble: 'loadingBubble',
  composer: 'composer',
  input: 'input',
  sendButton: 'sendButton'
};

const componentStyles = `
.chatShell{display:flex;flex-direction:column;min-height:560px;padding:20px;background:#f8fafc;border:1px solid #d9e2ec;border-radius:8px;color:#172033;font-family:"Segoe UI",Arial,sans-serif}
.header{display:flex;align-items:flex-start;gap:14px;margin-bottom:16px}
.headerIcon{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;flex:0 0 44px;border-radius:8px;background:#0f6cbd;color:#fff;font-size:22px}
.headerCopy{flex:1 1 auto;min-width:0}
.headerCopy h2{margin:0 0 4px 0;color:#111827;font-size:24px;font-weight:700;letter-spacing:0}
.headerCopy p{max-width:680px;margin:0;color:#536173;font-size:14px;line-height:1.5}
.clearButton{flex:0 0 auto}
.promptRow{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}
.promptButton{max-width:100%;border-radius:6px}
.promptButton .ms-Button-label{white-space:normal;text-align:left;line-height:1.3}
.errorBar{margin-bottom:12px}
.messages{flex:1 1 auto;display:flex;flex-direction:column;gap:12px;min-height:300px;max-height:520px;overflow-y:auto;padding:16px;background:#fff;border:1px solid #d9e2ec;border-radius:8px}
.messageRow{display:flex;width:100%}
.assistantMessageRow{justify-content:flex-start}
.userMessageRow{justify-content:flex-end}
.messageBubble{max-width:min(78%,720px);padding:12px 14px;border-radius:8px;font-size:14px;line-height:1.5;word-break:break-word}
.messageBubble p{margin:0 0 8px 0}
.messageBubble p:last-child{margin-bottom:0}
.messageBubble h4{margin:10px 0 8px 0;color:#12395f;font-size:15px;font-weight:700}
.assistantBubble{background:#edf6ff;color:#172033;border:1px solid #c8e0f4}
.userBubble{background:#0f6cbd;color:#fff}
.loadingBubble{min-width:120px}
.composer{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:end;margin-top:14px}
.input{min-width:0}
.sendButton{min-width:96px;height:40px;border-radius:6px}
@media screen and (max-width:640px){.chatShell{min-height:520px;padding:14px}.header{align-items:center}.headerCopy h2{font-size:20px}.messages{padding:12px;max-height:460px}.messageBubble{max-width:92%}.composer{grid-template-columns:1fr}.sendButton{width:100%}}
`;

function buildChatUrl(apiBaseUrl: string): string {
  return `${apiBaseUrl.replace(/\/+$/, '')}/api/chat`;
}

function renderReply(content: string): JSX.Element[] {
  return content.split(/\r?\n/).filter(Boolean).map((line, index) => {
    const heading = line.replace(/^#{1,6}\s*/, '');
    const stepMatch = line.match(/^(\d+\.)\s+\*\*(.+?)\*\*:?\s*(.*)$/);

    if (line !== heading) {
      return <h4 key={index}>{heading}</h4>;
    }

    if (stepMatch) {
      return (
        <p key={index}>
          <strong>{stepMatch[1]} {stepMatch[2]}:</strong> {stepMatch[3]}
        </p>
      );
    }

    return <p key={index}>{line.replace(/\*\*/g, '')}</p>;
  });
}

const ChatBot: React.FC<IChatBotProps> = ({ title, description, apiBaseUrl }) => {
  const [messages, setMessages] = useState<IChatMessage[]>([
    {
      id: 1,
      role: 'assistant',
      content:
        'Hi, I can help with SharePoint navigation, access, upload issues, and support ticket guidance.'
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const nextId = useRef<number>(2);
  const chatUrl = useMemo(() => buildChatUrl(apiBaseUrl), [apiBaseUrl]);

  const sendMessage = async (messageText: string): Promise<void> => {
    const trimmedMessage = messageText.trim();

    if (!trimmedMessage || isSending) {
      return;
    }

    const userMessage: IChatMessage = {
      id: nextId.current++,
      role: 'user',
      content: trimmedMessage
    };

    const history = messages
      .slice(-8)
      .map((message) => ({ role: message.role, content: message.content }));

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setInput('');
    setError('');
    setIsSending(true);

    try {
      const response = await fetch(chatUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: trimmedMessage,
          history
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'The chatbot service returned an error.');
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: nextId.current++,
          role: 'assistant',
          content: data?.reply || 'I did not receive a response from the assistant.'
        }
      ]);
    } catch (requestError) {
      const errorMessage =
        requestError instanceof Error
          ? requestError.message
          : 'Unable to reach the chatbot service.';

      setError(errorMessage);
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: nextId.current++,
          role: 'assistant',
          content: 'I could not connect to the support assistant. Please check the backend URL and try again.'
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const clearConversation = (): void => {
    setMessages([
      {
        id: nextId.current++,
        role: 'assistant',
        content: 'Conversation cleared. What SharePoint question can I help with next?'
      }
    ]);
    setError('');
    setInput('');
  };

  return (
    <section className={styles.chatShell}>
      <style>{componentStyles}</style>
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <Icon iconName="ChatBot" />
        </div>
        <div className={styles.headerCopy}>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <IconButton
          className={styles.clearButton}
          iconProps={{ iconName: 'Refresh' }}
          title="Clear conversation"
          ariaLabel="Clear conversation"
          onClick={clearConversation}
          disabled={isSending}
        />
      </div>

      <div className={styles.promptRow}>
        {starterPrompts.map((prompt) => (
          <DefaultButton
            key={prompt}
            className={styles.promptButton}
            text={prompt}
            onClick={() => {
              sendMessage(prompt).catch(() => undefined);
            }}
            disabled={isSending}
          />
        ))}
      </div>

      {error && (
        <MessageBar messageBarType={MessageBarType.error} className={styles.errorBar}>
          {error}
        </MessageBar>
      )}

      <div className={styles.messages} aria-live="polite">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.messageRow} ${
              message.role === 'user' ? styles.userMessageRow : styles.assistantMessageRow
            }`}
          >
            <div
              className={`${styles.messageBubble} ${
                message.role === 'user' ? styles.userBubble : styles.assistantBubble
              }`}
            >
              {message.role === 'assistant' ? renderReply(message.content) : <p>{message.content}</p>}
            </div>
          </div>
        ))}
        {isSending && (
          <div className={`${styles.messageRow} ${styles.assistantMessageRow}`}>
            <div className={`${styles.messageBubble} ${styles.assistantBubble} ${styles.loadingBubble}`}>
              <Spinner size={SpinnerSize.small} label="Thinking" />
            </div>
          </div>
        )}
      </div>

      <div className={styles.composer}>
        <TextField
          className={styles.input}
          multiline
          resizable={false}
          rows={2}
          placeholder="Ask about SharePoint access, files, pages, or tickets"
          value={input}
          onChange={(_, value) => setInput(value || '')}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              sendMessage(input).catch(() => undefined);
            }
          }}
          disabled={isSending}
        />
        <PrimaryButton
          className={styles.sendButton}
          iconProps={{ iconName: 'Send' }}
          text="Send"
          onClick={() => {
            sendMessage(input).catch(() => undefined);
          }}
          disabled={isSending || !input.trim()}
        />
      </div>
    </section>
  );
};

export default ChatBot;
