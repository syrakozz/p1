// RCTCalendarModule.m
#import "RCTOpusToWav.h"
#import <React/RCTLog.h>
#ifdef __cplusplus
#import <vector>
#import "OpusCodec.h"
#endif

@implementation RCTOpusToWav

// To export a module named RCTOpusToWav
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(execute:(NSArray *)opusData
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  RCTLogInfo(@"RCTOpusToWav execute");

  std::vector<unsigned char> opusDataVector;
  for (int i=0; i< [opusData count]; i++) {
    opusDataVector.push_back([[opusData objectAtIndex:i] intValue]);
  }
  
  OpusCodec opusCodec;
  std::vector<unsigned char> wavData = opusCodec.opusToWav(opusDataVector);
  
  const auto result = [NSMutableArray new];
  
  for (int i=0; i< wavData.size(); i++) {
    NSNumber *nSNumber = @(wavData.at(i));
    [result addObject:nSNumber];
  }

  if (result) {
    resolve(result);
  } else {
    reject(@"RCTOpusToWav failure", @"no result returned", nil);
  }
}

@end
