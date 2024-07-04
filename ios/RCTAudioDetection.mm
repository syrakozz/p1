// RCTCalendarModule.m
#import "RCTAudioDetection.h"
#import <React/RCTLog.h>
#import <vector>
#import "OpusCodec.h"
#import "voice-activity-detection/application-layer/DetectVoiceActivityUseCase.h"
#import "voice-activity-detection/adapters/libfvad-impl/DetectVoiceActivityDomainServiceWithLibfVad.h"

// Interface implementation
@implementation RCTAudioDetection

OpusCodec opusCodecVad;

DetectVoiceActivityDomainServiceWithLibfVad detectVoiceActivityDomainServiceWithLibfVad(16000,
                                                                                        10);

DetectVoiceActivityUseCase detectVoiceActivityUseCase(&detectVoiceActivityDomainServiceWithLibfVad,
                                                      1,
                                                      0.5);

// RCTResponseSenderBlock reactNativeCallback;

static void vadCallback(std::string status) {
  NSString* statusNSString = [NSString stringWithUTF8String:status.c_str()];
  RCTLogInfo(@"vadCallback was called with status: %@", statusNSString);
  // reactNativeCallback(@[statusNSString]);
}

// To export a module named RCTAudioDetection
RCT_EXPORT_MODULE();

- (id)init {
  opusCodecVad.initializeDecoder();
  detectVoiceActivityUseCase.initialize();
  return self;
}

-(void)dealloc {
  opusCodecVad.destroyDecoder();
  detectVoiceActivityUseCase.destroy();
}

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"AudioActivity"];
}

// Will be called when this module's first listener is added.
-(void)startObserving {
    // hasListeners = YES;
    // Set up any upstream listeners or background tasks as necessary
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
    // hasListeners = NO;
    // Remove upstream listeners, stop unnecessary background tasks
}


- (void)audioActivityChanged:(NSNotification *)notification {
  NSString *status = @"some status to be read by NSNotification *"; //notification.userInfo[@"status"];
  [self sendEventWithName:@"AudioActivity" body:@{@"status": status}];
}

RCT_EXPORT_METHOD(registerAudioStatusCallback:
                  (RCTResponseSenderBlock)callback) {
  RCTLogInfo(@"RCTAudioDetection registerAudioStatusCallback");
  // reactNativeCallback = callback;
  
  // FOR TESTING ONLY
  std::string status = "some status from VAD";
  NSString* statusNSString = [NSString stringWithUTF8String:status.c_str()];
  RCTLogInfo(@"Let's assume that vadCallback was called with status: %@", statusNSString);
  
  [self sendEventWithName:@"AudioActivity" body:@{@"status": statusNSString}];

  // reactNativeCallback(@[statusNSString]);
}

RCT_EXPORT_METHOD(streamOpusAudio:(NSArray *)input
                                  resolver:(RCTPromiseResolveBlock)resolve
                                  rejecter:(RCTPromiseRejectBlock)reject) {
  RCTLogInfo(@"RCTAudioDetection streamAudio");
  
  std::vector<unsigned char> opusDataVector;
  for (int i=0; i< [input count]; i++) {
    opusDataVector.push_back([[input objectAtIndex:i] intValue]);
  }

  std::vector<unsigned char> decodedOpusDataVector = opusCodecVad.decodeMultipleFrames(opusDataVector);

  std::string status = detectVoiceActivityUseCase.execute(decodedOpusDataVector);

  NSString* statusNSString = [NSString stringWithUTF8String:status.c_str()];
 
  if (statusNSString) {
    resolve(@{@"status": statusNSString});
  } else {
    reject(@"RCTAudioDetection failure", @"no statusNSString returned", nil);
  }
}

RCT_EXPORT_METHOD(stopStreaming) {
  RCTLogInfo(@"RCTAudioDetection stopStreaming");
  
  opusCodecVad.destroyDecoder();
  detectVoiceActivityUseCase.destroy();

  opusCodecVad.initializeDecoder();
  detectVoiceActivityUseCase.initialize();
}

RCT_EXPORT_METHOD(setParameters:
                  (double)thresholdLevelArg 
                  minActivityTimeArg:(double)minActivityTimeArg
                  minSilenceTimeArg:(double)minSilenceTimeArg) {
  RCTLogInfo(@"RCTAudioDetection setParameters: %f, %f, %f",
             (float)thresholdLevelArg, (float)minActivityTimeArg, (float)minSilenceTimeArg);
  
  detectVoiceActivityUseCase.setParameters((float)minSilenceTimeArg,
                                           (float)minActivityTimeArg);
}


@end
