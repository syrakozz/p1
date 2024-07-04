// RCTOpusCodec.mm
#import "RCTOpusCodec.h"
#import <React/RCTLog.h>
#import <vector>
#import "OpusCodec.h"

@implementation RCTOpusCodec

OpusCodec opusCodec;

// To export a module named RCTOpusCodec
RCT_EXPORT_MODULE();

/**
 * Encoder
 */

RCT_EXPORT_METHOD(initializeEncoder) {
  RCTLogInfo(@"RCTOpusCodec initializeEncoder");

  opusCodec.initializeEncoder();
}

RCT_EXPORT_METHOD(encodeOneFrame:(NSArray *)inputData
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  RCTLogInfo(@"RCTOpusCodec encodeOneFrame");

  std::vector<unsigned char> inputDataVector;
  inputDataVector.reserve([inputData count]);
  for (int i=0; i< [inputData count]; i++) {
    inputDataVector.push_back([[inputData objectAtIndex:i] intValue]);
  }

  std::vector<unsigned char> outputDataVector = opusCodec.encodeOneFrame(inputDataVector);

  const auto outputData = [NSMutableArray new];

  for (int i=0; i< outputDataVector.size(); i++) {
    NSNumber *nSNumber = @(outputDataVector.at(i));
    [outputData addObject:nSNumber];
  }

  if (outputData) {
    resolve(outputData);
  } else {
    reject(@"RCTOpusCodec encodeOneFrame failure", @"no result returned", nil);
  }
}

RCT_EXPORT_METHOD(encodeMultipleFrames:(NSArray *)inputData
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  RCTLogInfo(@"RCTOpusCodec encodeMultipleFrames");

  std::vector<unsigned char> inputDataVector;
  inputDataVector.reserve([inputData count]);
  for (int i=0; i< [inputData count]; i++) {
    inputDataVector.push_back([[inputData objectAtIndex:i] intValue]);
  }

  std::vector<unsigned char> outputDataVector = opusCodec.encodeMultipleFrames(inputDataVector);

  const auto outputData = [NSMutableArray new];

  for (int i=0; i< outputDataVector.size(); i++) {
    NSNumber *nSNumber = @(outputDataVector.at(i));
    [outputData addObject:nSNumber];
  }

  if (outputData) {
    resolve(outputData);
  } else {
    reject(@"RCTOpusCodec encodeMultipleFrames failure", @"no result returned", nil);
  }
}


RCT_EXPORT_METHOD(destroyEncoder) {
  RCTLogInfo(@"RCTOpusCodec destroyEncoder");

  opusCodec.destroyEncoder();
}


/**
 * Decoder
 */

RCT_EXPORT_METHOD(initializeDecoder) {
  RCTLogInfo(@"RCTOpusCodec initializeDecoder");

  opusCodec.initializeDecoder();
}


RCT_EXPORT_METHOD(decodeOneFrame:(NSArray *)inputData
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  RCTLogInfo(@"RCTOpusCodec decodeOneFrame");

  std::vector<unsigned char> inputDataVector;
  inputDataVector.reserve([inputData count]);
  for (int i=0; i< [inputData count]; i++) {
    inputDataVector.push_back([[inputData objectAtIndex:i] intValue]);
  }

  std::vector<unsigned char> outputDataVector = opusCodec.decodeOneFrame(inputDataVector);

  const auto outputData = [NSMutableArray new];

  for (int i=0; i< outputDataVector.size(); i++) {
    NSNumber *nSNumber = @(outputDataVector.at(i));
    [outputData addObject:nSNumber];
  }

  if (outputData) {
    resolve(outputData);
  } else {
    reject(@"RCTOpusCodec decodeOneFrame failure", @"no result returned", nil);
  }
}


RCT_EXPORT_METHOD(decodeMultipleFrames:(NSArray *)inputData
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  RCTLogInfo(@"RCTOpusCodec decodeMultipleFrames");

  std::vector<unsigned char> inputDataVector;
  inputDataVector.reserve([inputData count]);
  for (int i=0; i< [inputData count]; i++) {
    inputDataVector.push_back([[inputData objectAtIndex:i] intValue]);
  }

  std::vector<unsigned char> outputDataVector = opusCodec.decodeMultipleFrames(inputDataVector);

  const auto outputData = [NSMutableArray new];

  for (int i=0; i< outputDataVector.size(); i++) {
    NSNumber *nSNumber = @(outputDataVector.at(i));
    [outputData addObject:nSNumber];
  }

  if (outputData) {
    resolve(outputData);
  } else {
    reject(@"RCTOpusCodec decodeMultipleFrames failure", @"no result returned", nil);
  }
}


RCT_EXPORT_METHOD(destroyDecoder) {
  RCTLogInfo(@"RCTOpusCodec destroyDecoder");

  opusCodec.destroyDecoder();
}

/**
 * Common functions - Most Probably will not work from Javascript due to big size of data
 */

RCT_EXPORT_METHOD(amplifyPcm:(NSArray *)inputData
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  RCTLogInfo(@"RCTOpusCodec amplifyPcm");

  std::vector<unsigned char> inputDataVector;
  inputDataVector.reserve([inputData count]);
  for (int i=0; i< [inputData count]; i++) {
    inputDataVector.push_back([[inputData objectAtIndex:i] intValue]);
  }

  std::vector<unsigned char> outputDataVector = opusCodec.amplifyPcm(inputDataVector);

  const auto outputData = [NSMutableArray new];

  for (int i=0; i< outputDataVector.size(); i++) {
    NSNumber *nSNumber = @(outputDataVector.at(i));
    [outputData addObject:nSNumber];
  }

  if (outputData) {
    resolve(outputData);
  } else {
    reject(@"RCTOpusCodec amplifyPcm failure", @"no result returned", nil);
  }
}


RCT_EXPORT_METHOD(pcmToWav:(NSArray *)inputData
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  RCTLogInfo(@"RCTOpusCodec pcmToWav");

  std::vector<unsigned char> inputDataVector;
  inputDataVector.reserve([inputData count]);
  for (int i=0; i< [inputData count]; i++) {
    inputDataVector.push_back([[inputData objectAtIndex:i] intValue]);
  }

  std::vector<unsigned char> outputDataVector = opusCodec.pcmToWav(inputDataVector);

  const auto outputData = [NSMutableArray new];

  for (int i=0; i< outputDataVector.size(); i++) {
    NSNumber *nSNumber = @(outputDataVector.at(i));
    [outputData addObject:nSNumber];
  }

  if (outputData) {
    resolve(outputData);
  } else {
    reject(@"RCTOpusCodec pcmToWav failure", @"no result returned", nil);
  }
}


RCT_EXPORT_METHOD(wavToPcm:(NSArray *)inputData
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  RCTLogInfo(@"RCTOpusCodec wavToPcm");

  std::vector<unsigned char> inputDataVector;
  inputDataVector.reserve([inputData count]);
  for (int i=0; i< [inputData count]; i++) {
    inputDataVector.push_back([[inputData objectAtIndex:i] intValue]);
  }

  std::vector<unsigned char> outputDataVector = opusCodec.wavToPcm(inputDataVector);

  const auto outputData = [NSMutableArray new];

  for (int i=0; i< outputDataVector.size(); i++) {
    NSNumber *nSNumber = @(outputDataVector.at(i));
    [outputData addObject:nSNumber];
  }

  if (outputData) {
    resolve(outputData);
  } else {
    reject(@"RCTOpusCodec wavToPcm failure", @"no result returned", nil);
  }
}


@end
