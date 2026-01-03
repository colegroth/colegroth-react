import React, { useCallback, useState } from 'react';
import { Stack, Card, Text, Button, Grid, Box, Label } from '@sanity/ui';
import { useFormValue, set } from 'sanity';

// === HELPER: Convert Rich Text to String ===
const blocksToText = (blocks) => {
  if (!blocks) return "";
  if (typeof blocks === 'string') return blocks; // Handle legacy string data
  if (Array.isArray(blocks)) {
    return blocks
      .map(block => {
        if (block._type !== 'block' || !block.children) return '';
        return block.children.map(child => child.text).join('');
      })
      .join('\n\n');
  }
  return "";
};

const extractSentences = (text) => {
  if (!text) return [];
  return text.match(/[^\.!\?]+[\.!\?]+/g)?.map(s => s.trim()) || [];
};

// === COMPONENT 1: VERDICT GENERATOR ===
export const VerdictGenerator = (props) => {
  const { onChange, value } = props;
  const rawBody = useFormValue(['body']);
  const [candidates, setCandidates] = useState([]);

  const generateVerdicts = useCallback(() => {
    const bodyText = blocksToText(rawBody);
    if (!bodyText) return;
    
    const sentences = extractSentences(bodyText);
    if (sentences.length === 0) return;

    const options = [];
    // Last sentence (Summary)
    options.push(sentences[sentences.length - 1]);
    // First sentence (Hook)
    if (sentences.length > 1) options.push(sentences[0]);
    // Random middle sentence
    const middle = sentences.slice(1, -1).filter(s => s.length > 20 && s.length < 80);
    if (middle.length > 0) options.push(middle[Math.floor(Math.random() * middle.length)]);

    setCandidates([...new Set(options)]);
  }, [rawBody]);

  const selectVerdict = (text) => {
    onChange(set(text));
    setCandidates([]);
  };

  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      {candidates.length === 0 && <Button mode="ghost" tone="primary" text="✨ Generate Verdict Ideas" onClick={generateVerdicts} />}
      {candidates.length > 0 && (
        <Stack space={2}>
          <Label size={1}>Select a Verdict:</Label>
          <Grid columns={1} gap={2}>
            {candidates.map((text, i) => (
              <Card key={i} padding={3} radius={2} border style={{cursor: 'pointer', borderColor: text === value ? '#5227ff' : 'inherit'}} onClick={() => selectVerdict(text)} hoverEffect>
                <Text size={1} weight="medium">"{text}"</Text>
              </Card>
            ))}
          </Grid>
          <Button mode="bleed" tone="critical" fontSize={1} text="Clear Options" onClick={() => setCandidates([])} />
        </Stack>
      )}
    </Stack>
  );
};

// === COMPONENT 2: QUOTE GENERATOR ===
export const QuoteGenerator = (props) => {
  const { onChange, value } = props;
  const rawBody = useFormValue(['body']);
  const [candidates, setCandidates] = useState([]);

  const generateQuotes = useCallback(() => {
    const bodyText = blocksToText(rawBody);
    if (!bodyText) return;

    const sentences = extractSentences(bodyText);
    const valid = sentences.filter(s => s.length > 60 && s.length < 160);
    const shuffled = valid.sort(() => 0.5 - Math.random()).slice(0, 3);
    setCandidates(shuffled);
  }, [rawBody]);

  const addQuote = (text) => {
    const currentList = value || [];
    if (!currentList.includes(text)) {
      onChange(set([...currentList, text]));
    }
  };

  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      {candidates.length === 0 && <Button mode="ghost" tone="primary" text="✨ Generate Quote Options" onClick={generateQuotes} />}
      {candidates.length > 0 && (
        <Stack space={2}>
          <Label size={1}>Click to Add to List:</Label>
          <Grid columns={1} gap={2}>
            {candidates.map((text, i) => (
              <Card key={i} padding={3} radius={2} border style={{cursor: 'pointer'}} onClick={() => addQuote(text)} hoverEffect tone="positive">
                <Box flex={1}><Text size={1} style={{fontStyle: 'italic'}}>"{text}"</Text></Box>
              </Card>
            ))}
          </Grid>
          <Button mode="bleed" tone="critical" fontSize={1} text="Clear Options" onClick={() => setCandidates([])} />
        </Stack>
      )}
    </Stack>
  );
};