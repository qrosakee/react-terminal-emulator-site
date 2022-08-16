import './terminal.css';
import {ForwardedRef, forwardRef, useCallback, useEffect, useRef, useState} from "react";
import { TerminalProps } from "./types";

class ListNode {
    val: string | null;
    next: ListNode;
    prev: ListNode;
    constructor(prev:ListNode | null = null, val:string | null  = null, next:ListNode | null = null) {
        this.val = val;
        this.next = this;
        this.prev = this;
        if (next != null) {
            this.next = next;
        }
        if (prev != null) {
            this.prev = prev;
        }

    }

    add(a:string) {
        if (this.val == null) {
            let aNode = new ListNode(this, a, null);
            this.next = aNode;
            return aNode;
        } else {
            let aNode = new ListNode(this.prev, a, this);
            if (this.prev == null) {
                throw Error("null pointer in linked list");
            }
            this.prev.next = aNode;
            this.prev = aNode;
            return aNode;
        }
    }
}

export const Terminal = forwardRef(
    (props: TerminalProps, ref: ForwardedRef<HTMLDivElement>) => {
        const {
            history = [],
            promptLabel = '>',
            pushToHistory = () => { },
            commands = {},
        } = props;

    const inputRef = useRef<HTMLInputElement>();
    const [input, setInputValue] = useState<string>('');

    const [hist, setHist] = useState<ListNode>(new ListNode());

    /**
     * Focus on the input whenever we render the terminal or click in the terminal
     */
    useEffect(() => {
      inputRef.current?.focus();
    });

    const focusInput = useCallback(() => {
      inputRef.current?.focus();
    }, []);



    /**
     * When user types something, we update the input value
     */
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
      },
      []
    );

    /**
     * When user presses enter, we execute the command
     */
    const handleInputKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == "\\" ) { // up arrow
            setHist(hist.next);
            setInputValue(hist.val || '');
            //console.log(hist);
        }
        else if (e.key == '/') { // down arrow, doesn't work right now. change to 40 when it works.
            setHist(hist.prev);
            setInputValue(hist.val || '');
            console.log(hist);
            }
        else if (e.key === 'Enter') {
            const commandToExecute = commands?.[input.toLowerCase()];
            pushToHistory(<div>root{'>'} {input.toLowerCase()}</div>);
            setHist(hist.add(input.toLowerCase()));
            if (commandToExecute) {
                commandToExecute?.();
            } else {
                pushToHistory(<>command not found</>);
            }
          setInputValue('');
        }
      },
      [commands, input]
    );

    return (
    <div className="terminal" ref={ref} onClick={focusInput}>
      {history.map((line, index) => (
        <div className="terminal__line" key={`terminal-line-${index}-${line}`}>
          {line}
        </div>
      ))}
      <div className="terminal__prompt">
        <div className="terminal__prompt__label">{promptLabel}</div>
        <div className="terminal__prompt__input">
          <input
            type="text"
            value={input}
            onKeyDown={handleInputKeyDown}
            onChange={handleInputChange}
            // @ts-ignore
            ref={inputRef}
          />
        </div>
      </div>
    </div>
  );
});