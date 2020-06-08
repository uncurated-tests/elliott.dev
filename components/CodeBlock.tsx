import Highlight, { defaultProps, Language, Prism } from 'prism-react-renderer';
import vsDark from 'prism-react-renderer/themes/vsDark';
import React from 'react';

import styled from '@emotion/styled';

const isLanguageValid = (language: string): language is Language => language in Prism.languages;

const Pre = styled.pre`
  overflow: auto;
`;

/**
 * https://mdxjs.com/guides/syntax-highlighting
 */
const CodeBlock: React.FC<{ children: string; className: string }> = ({ children, className }) => {
  const language = className.replace(/language-/, '');
  if (!isLanguageValid(language)) {
    throw new Error(`Invalid language ${language}`);
  }

  return (
    <Highlight {...defaultProps} code={children} language={language} theme={vsDark}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Pre className={className} style={{ ...style, padding: '20px' }}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </Pre>
      )}
    </Highlight>
  );
};

export default CodeBlock;