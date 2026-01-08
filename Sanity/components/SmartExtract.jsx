import React, { useCallback } from 'react';
import { Button, Stack, Text, ToastProvider, useToast } from '@sanity/ui';
import { useFormValue, set } from 'sanity';

export const SmartExtract = (props) => {
  const { onChange } = props;
  const bodyText = useFormValue(['body']) || "";
  const toast = useToast();

  const handleGenerate = useCallback(() => {
    if (!bodyText) {
      toast.push({ status: 'error', title: 'Review Body is empty!' });
      return;
    }

    // 1. Clean and split text into sentences
    // This regex looks for punctuation (.!?) followed by a space or end of string
    const sentences = bodyText.match(/[^\.!\?]+[\.!\?]+/g) || [];
    const cleanSentences = sentences.map(s => s.trim());

    // 2. Verdict Logic: Grab the very last sentence
    const generatedVerdict = cleanSentences.length > 0 
      ? cleanSentences[cleanSentences.length - 1] 
      : "";

    // 3. Quote Logic: Find "punchy" sentences (approx 60-150 characters)
    // We prioritize sentences that aren't too short (dialogue) or too long (run-on)
    const candidates = cleanSentences.filter(s => s.length > 60 && s.length < 150);
    
    // Pick up to 2 random candidates
    const shuffled = candidates.sort(() => 0.5 - Math.random());
    const generatedQuotes = shuffled.slice(0, 2);

    // 4. Update the document
    // Note: We can only patch the field this component is attached to.
    // If attached to "quotes", we patch quotes. 
    // To do both, we need a "Document Action", but this input is safer for now.
    
    onChange(set(generatedQuotes));
    
    // We can't easily patch "verdict" from the "quotes" input without a client.
    // So we will Copy the verdict to clipboard for you.
    navigator.clipboard.writeText(generatedVerdict);
    
    toast.push({ 
      status: 'success', 
      title: 'Quotes Generated!', 
      description: 'Verdict copied to clipboard.' 
    });

  }, [bodyText, onChange, toast]);

  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      <Button 
        mode="ghost" 
        tone="primary" 
        text="✨ Auto-Extract Quotes & Copy Verdict" 
        onClick={handleGenerate} 
      />
      <Text size={1} muted>Clicking this will replace current quotes and copy the last sentence of your review to your clipboard (paste it in Verdict).</Text>
    </Stack>
  );
};