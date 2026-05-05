import * as React from 'react';
import { useMemo, useRef, useState } from 'react';
import {
  DefaultButton,
  Icon,
  IconButton,
  MessageBar,
  MessageBarType,
  PrimaryButton,
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
  chatWidget: 'chatWidget',
  launcherButton: 'launcherButton',
  chatShell: 'chatShell',
  chatShellOpen: 'chatShellOpen',
  header: 'header',
  headerIcon: 'headerIcon',
  headerCopy: 'headerCopy',
  headerActions: 'headerActions',
  clearButton: 'clearButton',
  closeButton: 'closeButton',
  slashSuggestions: 'slashSuggestions',
  slashSuggestionButton: 'slashSuggestionButton',
  errorBar: 'errorBar',
  messages: 'messages',
  messageRow: 'messageRow',
  assistantMessageRow: 'assistantMessageRow',
  userMessageRow: 'userMessageRow',
  messageBubble: 'messageBubble',
  userBubble: 'userBubble',
  assistantBubble: 'assistantBubble',
  loadingBubble: 'loadingBubble',
  thinkingText: 'thinkingText',
  thinkingDots: 'thinkingDots',
  composer: 'composer',
  input: 'input',
  sendButton: 'sendButton'
};

const componentStyles = `
.chatWidget{position:fixed;right:24px;bottom:24px;z-index:100000;display:flex;flex-direction:column;align-items:flex-end;font-family:"Segoe UI",Arial,sans-serif}
.launcherButton{display:inline-flex;align-items:center;justify-content:center;width:60px;height:60px;border:0;border-radius:50%;background:#0f6cbd;color:#fff;box-shadow:0 18px 36px rgba(15,108,189,.32);cursor:pointer;font-size:28px;transition:transform .16s ease,box-shadow .16s ease,background .16s ease}
.launcherButton:hover{background:#0b5cab;box-shadow:0 20px 42px rgba(15,108,189,.4);transform:translateY(-2px)}
.launcherButton:active{transform:translateY(0)}
.chatShell{display:flex;flex-direction:column;width:380px;height:520px;max-width:calc(100vw - 32px);max-height:calc(100vh - 112px);padding:18px;background:#f8fafc;border:1px solid #d9e2ec;border-radius:8px;color:#172033;box-shadow:0 22px 58px rgba(15,23,42,.24);margin-bottom:14px}
.chatShellOpen{animation:chatPanelIn .16s ease-out}
@keyframes chatPanelIn{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
.header{display:flex;align-items:flex-start;gap:14px;margin-bottom:16px}
.headerIcon{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;flex:0 0 40px;border-radius:8px;background:#0f6cbd;color:#fff;font-size:20px}
.headerCopy{flex:1 1 auto;min-width:0}
.headerCopy h2{margin:0 0 4px 0;color:#111827;font-size:18px;font-weight:700;letter-spacing:0}
.headerCopy p{max-width:680px;margin:0;color:#536173;font-size:12px;line-height:1.4}
.headerActions{display:flex;align-items:center;gap:2px;flex:0 0 auto}
.clearButton,.closeButton{flex:0 0 auto}
.slashSuggestions{display:flex;flex-direction:column;gap:8px;margin-top:10px;padding:10px;background:#fff;border:1px solid #d9e2ec;border-radius:8px;box-shadow:0 10px 26px rgba(15,23,42,.1)}
.slashSuggestionButton{max-width:100%;border-radius:6px}
.slashSuggestionButton .ms-Button-label{white-space:normal;text-align:left;line-height:1.3}
.errorBar{margin-bottom:12px}
.messages{flex:1 1 auto;display:flex;flex-direction:column;gap:12px;min-height:0;overflow-y:auto;padding:14px;background:#fff;border:1px solid #d9e2ec;border-radius:8px}
.messageRow{display:flex;width:100%}
.assistantMessageRow{justify-content:flex-start}
.userMessageRow{justify-content:flex-end}
.messageBubble{max-width:86%;padding:12px 14px;border-radius:8px;font-size:13px;line-height:1.5;word-break:break-word}
.messageBubble p{margin:0 0 8px 0}
.messageBubble p:last-child{margin-bottom:0}
.messageBubble h4{margin:10px 0 8px 0;color:#12395f;font-size:15px;font-weight:700}
.assistantBubble{background:#edf6ff;color:#172033;border:1px solid #c8e0f4}
.userBubble{background:#0f6cbd;color:#fff}
.loadingBubble{min-width:150px;display:flex;align-items:center;justify-content:center;gap:4px;color:#7c3aed;font-weight:600}
.thinkingText{display:inline-flex;align-items:center}
.thinkingDots{position:relative;display:inline-block;width:18px;height:16px;margin-left:1px}
.thinkingDots::after{content:"...";position:absolute;left:0;top:-1px;letter-spacing:1px;animation:thinkingDots 1.2s ease-in-out infinite}
@keyframes thinkingDots{0%,100%{opacity:.35;transform:translateY(0)}50%{opacity:1;transform:translateY(-1px)}}
.composer{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;margin-top:14px}
.input{min-width:0}
.input textarea{height:40px;min-height:40px;padding-top:9px;padding-bottom:9px;overflow:hidden;resize:none}
.sendButton{min-width:96px;height:40px;border-radius:6px}
@media screen and (max-width:640px){.chatWidget{right:16px;bottom:16px}.launcherButton{width:56px;height:56px}.chatShell{width:calc(100vw - 32px);height:min(520px,calc(100vh - 104px));padding:14px}.header{align-items:center}.headerCopy h2{font-size:17px}.headerCopy p{display:none}.messages{padding:12px}.messageBubble{max-width:92%}.composer{grid-template-columns:1fr}.sendButton{width:100%}}
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
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
  const slashQuery = input.startsWith('/') ? input.slice(1).trim().toLowerCase() : '';
  const shouldShowSlashSuggestions = input.startsWith('/');
  const filteredStarterPrompts = starterPrompts.filter((prompt) =>
    prompt.toLowerCase().includes(slashQuery)
  );

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
    <div className={styles.chatWidget}>
      <style>{componentStyles}</style>
      {isOpen && (
        <section className={`${styles.chatShell} ${styles.chatShellOpen}`} aria-label={title}>
          <div className={styles.header}>
            <div className={styles.headerIcon}>
              <Icon iconName="ChatBot" />
            </div>
            <div className={styles.headerCopy}>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
            <div className={styles.headerActions}>
              <IconButton
                className={styles.clearButton}
                iconProps={{ iconName: 'Refresh' }}
                title="Clear conversation"
                ariaLabel="Clear conversation"
                onClick={clearConversation}
                disabled={isSending}
              />
              <IconButton
                className={styles.closeButton}
                iconProps={{ iconName: 'ChromeClose' }}
                title="Close chatbot"
                ariaLabel="Close chatbot"
                onClick={() => setIsOpen(false)}
              />
            </div>
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
                  <span className={styles.thinkingText}>Thinking</span>
                  <span className={styles.thinkingDots} aria-hidden="true" />
                </div>
              </div>
            )}
          </div>

          <div className={styles.composer}>
            <TextField
              className={styles.input}
              multiline
              resizable={false}
              rows={1}
              placeholder="Ask a SharePoint question"
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
            {shouldShowSlashSuggestions && filteredStarterPrompts.length > 0 && (
              <div className={styles.slashSuggestions}>
                {filteredStarterPrompts.map((prompt) => (
                  <DefaultButton
                    key={prompt}
                    className={styles.slashSuggestionButton}
                    text={prompt}
                    onClick={() => {
                      sendMessage(prompt).catch(() => undefined);
                    }}
                    disabled={isSending}
                  />
                ))}
              </div>
            )}
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
      )}

      {!isOpen && (
        <button
          type="button"
          className={styles.launcherButton}
          title="Open chatbot"
          aria-label="Open chatbot"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
        >
          <Icon iconName="ChatBot" />
        </button>
      )}
    </div>
  );
};

export default ChatBot;
