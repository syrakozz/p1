import { AppHeader, MainContainer } from '$layout';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ListItem, Spinner, YGroup, YStack } from 'tamagui';
import { Button } from '$components';
import { type Purchase, PurchaseError, useIAP } from 'react-native-iap';
import { Platform } from 'react-native';
import { sendIAPReceiptAndroid, sendIAPReceiptIOS } from '../../api/vox.api';
import { extraConsoleDetails } from '../../../config';
import HelpDialog from '../help/help-dialog';

const SKUS = [
  '2xl_iap_18',
  '2xl_iap_49',
  '2xl_iap_103',
  '2xl_iap_215',
  // 'com.d1srupt1ve.2xl_dev.vexels01',
  // 'com.d1srupt1ve.2xl_dev.vexels02',
];

export default function BalanceScreen(): JSX.Element {
  const { t } = useTranslation();
  const { connected, getProducts, products, requestPurchase, currentPurchase, finishTransaction } = useIAP();

  const [buying, setBuying] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (connected) {
      getProducts({ skus: SKUS || [] });
    }
  }, [connected, getProducts]);

  // useEffect(() => {
  //   console.log('products', products);
  // }, [products]);

  useEffect(() => {
    const checkCurrentPurchase = async (purchase: Purchase | undefined) => {
      if (purchase) {
        try {
          const receipt = purchase.transactionReceipt;
          console.log('receipt:', receipt, 'aaaaaa', typeof receipt);
          if (Platform.OS === 'ios') {
            await sendIAPReceiptIOS(purchase);
          } else if (Platform.OS === 'android') {
            // const purchaseToken = (receipt as any).purchaseToken as string;
            // console.log({ purchaseToken });

            await sendIAPReceiptAndroid(JSON.parse(receipt));
          }
        } catch (error) {
          if (extraConsoleDetails) console.log('useEffect(): Catch during purchase transaction');
          console.log('error', error);
        } finally {
          await finishTransaction({ purchase, isConsumable: true });
        }
      }
    };
    checkCurrentPurchase(currentPurchase);
  }, [currentPurchase, finishTransaction]);

  const handleBuyProduct = async (productId: string) => {
    setBuying(productId);
    try {
      const params = Platform.select({
        ios: {
          sku: productId,
          andDangerouslyFinishTransactionAutomaticallyIOS: false,
        },
        android: {
          skus: [productId],
        },
      });

      await requestPurchase(params as any);
    } catch (error) {
      if (error instanceof PurchaseError) {
        console.error({ message: `[${error.code}]: ${error.message}`, error });
      } else {
        console.error({ message: 'handleBuySubscription', error });
      }
    } finally {
      setBuying(undefined);
    }
  };

  return (
    <MainContainer
     header={<AppHeader title={t('balance.title')} canGoBack  showBalance={true}  />}
    fab={{
      icon: <HelpDialog
      isAuto={true}
      helpId={'help.balance'}/>,
    }}
    >
      <YStack space="$3" maxWidth={600} width="100%" mx="auto" flex={1} justifyContent="flex-start">
        {!products || products.length === 0 ? (
          <Spinner size="large" mt="$10" />
        ) : (
          products
            .sort((a, b) => {
              return SKUS.indexOf(a.productId) - SKUS.indexOf(b.productId);
            })
            .map(product => (
              <YGroup key={product.productId}>
                <YGroup.Item>
                  <ListItem
                    size="$5"
                    title={product.title}
                    subTitle={product.description}
                    iconAfter={
                      <Button
                        variant="outlined"
                        onPress={() => handleBuyProduct(product.productId)}
                        disabled={!!buying}
                        loading={buying === product.productId}>
                        {product.localizedPrice}
                      </Button>
                    }
                  />
                </YGroup.Item>
              </YGroup>
            ))
        )}
      </YStack>
    </MainContainer>
  );
}
