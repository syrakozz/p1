import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import './src/i18n/i18n.config';
import Root from './Root';
import { SafeAreaView } from 'react-native';
import { queryClient } from './config';

function App(): JSX.Element {
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <SafeAreaView style={{ width: '100%', height: '100%' }}>
      <QueryClientProvider client={queryClient}>
        <Root />
      </QueryClientProvider>
    </SafeAreaView>
  );
}

export default App;
