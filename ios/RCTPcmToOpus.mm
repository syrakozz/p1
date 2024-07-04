// RCTCalendarModule.m
#import "RCTPcmToOpus.h"
#import <React/RCTLog.h>
#ifdef __cplusplus
#import <vector>
#import "OpusCodec.h"
#endif

@implementation RCTPcmToOpus

// To export a module named RCTOpusEncoder
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(execute:(NSArray *)pcmData
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  RCTLogInfo(@"RCTPcmToOpus execute");
  
  std::vector<unsigned char> pcmDataVector;
  for (int i=0; i< [pcmData count]; i++) {
    pcmDataVector.push_back([[pcmData objectAtIndex:i] intValue]);
  }

  OpusCodec opusCodec;
  std::vector<unsigned char> opusData = opusCodec.pcmToOpus(pcmDataVector);

  const auto result = [NSMutableArray new];
  
  for (int i=0; i< opusData.size(); i++) {
    NSNumber *nSNumber = @(opusData.at(i));
    [result addObject:nSNumber];
  }

  if (result) {
    resolve(result);
  } else {
    reject(@"RCTPcmToOpus failure", @"no result returned", nil);
  }
}

@end
