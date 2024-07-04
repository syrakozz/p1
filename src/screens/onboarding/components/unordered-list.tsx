import React from 'react';
import { Paragraph, Text, View } from 'tamagui';

export default function UnorderedList({ data }: { data: string[] }) {
  return (
    <View my="$2.5">
      {data.map((item, index) => (
        <View key={index} flexDirection="row" my="$1.5">
          <Text fontSize="$6" fontWeight="600">
            {'\u2022'}
          </Text>
          <Paragraph ml="$3">{item}</Paragraph>
        </View>
      ))}
    </View>
  );
}
