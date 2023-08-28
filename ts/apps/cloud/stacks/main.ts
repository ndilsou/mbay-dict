import {
  NextjsSite,
  Api,
  Stack,
  StackContext,
  EventBus,
  Bucket,
  Config,
} from "sst/constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as logs from "aws-cdk-lib/aws-logs";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cdk from "aws-cdk-lib";
import { Platform } from "aws-cdk-lib/aws-ecr-assets";

import { getEnv, getWebDomainName, workspaceRoot } from "../utils";
import path from "path";

export function Main({ stack }: StackContext) {
  stack.addDefaultFunctionEnv({
    STAGE: stack.stage,
    LOG_LEVEL: "DEBUG",
  });
  const root = workspaceRoot();

  const publicFiles = new Bucket(stack, "publicFiles", {
    cdk: {
      bucket: {
        publicReadAccess: true,
      },
    },
  });

  // const MONGODB_URI = new Config.Secret(stack, "MONGODB_URI");

  // const site = new NextjsSite(stack, "web", {
  //   path: "../web/",
  //   runtime: "nodejs18.x",
  //   // customDomain: {
  //   //   domainName: getWebDomainName(stack.stage),
  //   //   hostedZone: "tranquil.voltor.be",
  //   // },
  //   environment: {
  //     MONGODB_URI: getEnv("MONGODB_URI"),
  //     NEXT_PUBLIC_BUCKET_NAME: publicFiles.bucketName,
  //   },
  //   bind: [MONGODB_URI],
  // });

  stack.addOutputs({
    publicFilesBucketName: publicFiles.bucketName,
    // HttpApiUrl: httpApi.url,
    // WebsiteUrl: site.url,
    // WebsiteDomainName: site.customDomainUrl,
  });
}
type ApiInput = {
  root: string;
  parameters: Record<string, ssm.IStringParameter>;
};

function createHttpApi(
  stack: Stack,
  { parameters: parameters, root }: ApiInput
) {
  const fn = createMonolithFunction(stack, "httpApiFn", {
    functionName: `${stack.stage}-http-api-fn`,
    handler: "tranquil.apigw.http.lambda_handler",
    root,
    parameters,
  });

  const api = new Api(stack, "httpApi", {
    routes: {
      $default: {
        cdk: {
          function: fn,
        },
      },
    },
  });
  return api;
}

type ApiFunctionProps = {
  functionName: string;
  handler: string;
  timeout?: cdk.Duration;
  root: string;
  parameters: Record<string, ssm.IStringParameter>;
  environments?: Record<string, string>;
};

function createMonolithFunction(
  stack: Stack,
  id: string,
  props: ApiFunctionProps
) {
  const fn = new lambda.DockerImageFunction(stack, id, {
    functionName: props.functionName,
    timeout: props.timeout || cdk.Duration.seconds(30),
    architecture: lambda.Architecture.ARM_64,
    memorySize: 512,
    code: lambda.DockerImageCode.fromImageAsset(
      path.join(props.root, "py/projects/apigw/"),
      {
        platform: Platform.LINUX_ARM64,
        cmd: [props.handler],
      }
    ),
    tracing: lambda.Tracing.ACTIVE,
    logRetention: logs.RetentionDays.SIX_MONTHS,
    environment: {
      STAGE: stack.stage,
      LOG_LEVEL: "DEBUG",
      POWERTOOLS_SERVICE_NAME: "apigw",
      ...props.environments,
    },
  });
  for (const [name, param] of Object.entries(props.parameters)) {
    param.grantRead(fn);
  }
  return fn;
}

function getSsmSecret(stack: Stack, name: string) {
  return ssm.StringParameter.fromSecureStringParameterAttributes(
    stack,
    `${name}SsmSecret`,
    {
      parameterName: `/sst/cloud/${stack.stage}/Secret/${name}/value`,
    }
  );
}
