export interface paths {
    "/api/v1/captcha/codeCaptcha": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Captcha_GetCodeCaptcha"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/captcha/graphicCaptcha": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Captcha_GetImageCaptcha"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/favorites": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Favorite_CreateFavorites"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/favorites/{favoritesId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["Favorite_DeleteFavorites"];
        options?: never;
        head?: never;
        patch: operations["Favorite_ModifyFavorites"];
        trace?: never;
    };
    "/api/v1/user/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Identity_Login"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/profile/avatar": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["FileService_UploadAvatar"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Identity_Register"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/{userId}/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Identity_Logout"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/userinfo/{userId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Userinfo_Userinfo"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/userinfo/{userId}/forgetPassword": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Userinfo_ForgetPassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/userinfo/{userId}/modifyEmail": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Userinfo_ModifyEmail"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/userinfo/{userId}/modifyPassword": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Userinfo_ModifyPassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/userinfo/{userId}/modifySignature": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Userinfo_ModifyUserSignature"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/userinfo/{userId}/modifyUsername": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Userinfo_ModifyUsername"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/video/interaction/{videoId}/barrage/send": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["VideoInteract_VideoSendBarrage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/video/interaction/{videoId}/barrage/upvote": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: operations["VideoInteract_VideoUpvoteBarrage"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/video/interaction/{videoId}/favorite": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: operations["VideoInteract_VideoFavorite"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/video/interaction/{videoId}/share": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["VideoInteract_VideoShare"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/video/interaction/{videoId}/throwShells": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: operations["VideoInteract_VideoThrowShells"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/video/interaction/{videoId}/upvote": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: operations["VideoInteract_VideoUpvote"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/video/list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["VideoInfo_GetVideoList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/video/{videoId}/comment": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["VideoComment_GetCommentList"];
        put?: never;
        post: operations["VideoComment_CommentVideo"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/video/{videoId}/comment/{commentId}/upvote": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: operations["VideoComment_UpvoteComment"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/video/{videoId}/comments/{commentId}/replies": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["VideoComment_GetCommentReplies"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/video/{videoId}/info": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["VideoInfo_GetVideoInfo"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/{userId}/follow": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: operations["Follow_UnfollowUser"];
        post: operations["Follow_FollowUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/{userId}/followList": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Follow_GetFolloweeInfo"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/{userId}/profile/avatar": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: operations["FileService_UpdateAvatar"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/{userId}/video/metaInfo": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description Request Order: 1. UploadVideoInfo 2. UploadVideoFile 3. UploadVideoCover
         *      1(UploadVideoInfo) Will Create a new directory for the video,
         *      2(UploadVideoFile) and 3(UploadVideoCover) will upload the video file and cover file to the directory.
         *      The order of 2 and 3 is not important.
         */
        post: operations["VideoInfo_UploadVideoInfo"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/{userId}/video/{videoId}/cover": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["VideoInfo_GetVideoCover"];
        put?: never;
        post: operations["VideoInfo_UploadVideoCover"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/{userId}/video/{videoId}/dash/mpd": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["VideoInfo_GetMpd"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/{userId}/video/{videoId}/dash/{segmentName}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["VideoInfo_GetSegments"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/{userId}/video/{videoId}/file": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["VideoInfo_DownloadVideo"];
        put?: never;
        post: operations["VideoInfo_UploadVideoFile"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        "gateway.api.v1.user.captcha.GetCodeCaptchaResp": {
            /** Format: int32 */
            statusCode?: number;
            msg?: string;
            code?: string;
        };
        "gateway.api.v1.user.captcha.GetImageCaptchaResp": {
            /** Format: int32 */
            statusCode?: number;
            msg?: string;
            captchaResult?: components["schemas"]["gateway.api.v1.user.captcha.GetImageCaptchaResp_CaptchaResult"];
        };
        "gateway.api.v1.user.captcha.GetImageCaptchaResp_CaptchaResult": {
            id?: string;
            b64log?: string;
            answer?: string;
        };
        "gateway.api.v1.user.favorites.CreateFavoritesReq": {
            favoritesName?: string;
            /** Format: int32 */
            isPrivate?: number;
            description?: string;
            userId?: string;
        };
        "gateway.api.v1.user.favorites.CreateFavoritesResp": {
            /** Format: int32 */
            statusCode?: number;
            msg?: string;
        };
        "gateway.api.v1.user.favorites.DeleteFavoritesResp": {
            /** Format: int32 */
            statusCode?: number;
            msg?: string;
        };
        "gateway.api.v1.user.favorites.ModifyFavoritesReq": {
            favoritesId?: string;
            favoritesName?: string;
            /** Format: int32 */
            isPrivate?: number;
            description?: string;
        };
        "gateway.api.v1.user.favorites.ModifyFavoritesResp": {
            /** Format: int32 */
            statusCode?: number;
            msg?: string;
        };
        "gateway.api.v1.user.file.UpdateAvatarReq": {
            userId?: string;
        };
        "gateway.api.v1.user.file.UpdateAvatarResp": {
            /** Format: int32 */
            statusCode?: number;
            message?: string;
        };
        "gateway.api.v1.user.file.UploadAvatarResp": {
            filePath?: string;
        };
        "gateway.api.v1.user.follow.FollowUserReq": {
            userId?: string;
            followerUserId?: string;
            followListId?: string;
        };
        "gateway.api.v1.user.follow.FollowUserResp": {
            /** Format: int32 */
            statusCode?: number;
            message?: string;
        };
        "gateway.api.v1.user.follow.GetFolloweeInfoResp": {
            /** Format: int32 */
            statusCode?: number;
            message?: string;
            followeeInfo?: components["schemas"]["gateway.api.v1.user.follow.GetFolloweeInfoResp_UserSummary"][];
        };
        "gateway.api.v1.user.follow.GetFolloweeInfoResp_UserSummary": {
            username?: string;
            avatarPath?: string;
            /** Format: int32 */
            gender?: number;
            signature?: string;
            email?: string;
            /** Format: date-time */
            birthday?: string;
        };
        "gateway.api.v1.user.follow.UnfollowUserReq": {
            userId?: string;
            followedUserId?: string;
        };
        "gateway.api.v1.user.follow.UnfollowUserResp": {
            /** Format: int32 */
            statusCode?: number;
            message?: string;
        };
        /** @description 用户登录所需请求、响应 */
        "gateway.api.v1.user.id.LoginRequest": {
            username?: string;
            password?: string;
        };
        "gateway.api.v1.user.id.LoginResp": {
            /**
             * Format: int32
             * @description app status code,The same below
             */
            statusCode?: number;
            /** @description app response message,The same below */
            msg?: string;
            data?: components["schemas"]["gateway.api.v1.user.id.LoginResp_Data"];
        };
        /** @description when users login successfully, return their ID and two tokens */
        "gateway.api.v1.user.id.LoginResp_Data": {
            accessToken?: string;
            refreshToken?: string;
            userId?: string;
        };
        /** @description 用户注销所需请求、响应 */
        "gateway.api.v1.user.id.LogoutRequest": {
            userId?: string;
        };
        "gateway.api.v1.user.id.LogoutResp": {
            /** Format: int32 */
            statusCode?: number;
            msg?: string;
        };
        /** @description 用户注册所需请求、响应 */
        "gateway.api.v1.user.id.RegisterRequest": {
            username?: string;
            password?: string;
            repeatPassword?: string;
            /** Format: int32 */
            gender?: number;
            email?: string;
            birthday?: string;
            signature?: string;
            inputCode?: string;
        };
        "gateway.api.v1.user.id.RegisterResp": {
            /** Format: int32 */
            statusCode?: number;
            msg?: string;
            data?: components["schemas"]["gateway.api.v1.user.id.RegisterResp_Data"];
        };
        "gateway.api.v1.user.id.RegisterResp_Data": {
            accessToken?: string;
            refreshToken?: string;
        };
        "gateway.api.v1.user.userinfo.CommonResp": {
            /** Format: int32 */
            status?: number;
            message?: string;
        };
        "gateway.api.v1.user.userinfo.ForgetPasswordReq": {
            userId?: string;
            email?: string;
            newPassword?: string;
            inputCode?: string;
        };
        "gateway.api.v1.user.userinfo.ForgetPasswordResp": {
            common?: components["schemas"]["gateway.api.v1.user.userinfo.CommonResp"];
        };
        "gateway.api.v1.user.userinfo.ModifyEmailReq": {
            userId?: string;
            email?: string;
            inputCode?: string;
        };
        "gateway.api.v1.user.userinfo.ModifyEmailResp": {
            email?: string;
            common?: components["schemas"]["gateway.api.v1.user.userinfo.CommonResp"];
        };
        "gateway.api.v1.user.userinfo.ModifyPasswordReq": {
            userId?: string;
            oldPassword?: string;
            newPassword?: string;
        };
        "gateway.api.v1.user.userinfo.ModifyPasswordResp": {
            common?: components["schemas"]["gateway.api.v1.user.userinfo.CommonResp"];
        };
        "gateway.api.v1.user.userinfo.ModifySignatureReq": {
            userId?: string;
            signature?: string;
        };
        "gateway.api.v1.user.userinfo.ModifySignatureResp": {
            newSignature?: string;
            common?: components["schemas"]["gateway.api.v1.user.userinfo.CommonResp"];
        };
        "gateway.api.v1.user.userinfo.ModifyUsernameReq": {
            userId?: string;
            newUsername?: string;
        };
        "gateway.api.v1.user.userinfo.ModifyUsernameResp": {
            newUsername?: string;
            common?: components["schemas"]["gateway.api.v1.user.userinfo.CommonResp"];
        };
        "gateway.api.v1.user.userinfo.UserInfo": {
            userName?: string;
            email?: string;
            signature?: string;
            /** Format: int32 */
            shells?: number;
            /** Format: int32 */
            cntFans?: number;
            /** Format: int32 */
            cntFollows?: number;
            /** Format: int32 */
            cntVideos?: number;
            avatarPath?: string;
            /** Format: int32 */
            gender?: number;
            birthday?: string;
        };
        "gateway.api.v1.user.userinfo.UserinfoResp": {
            userInfo?: components["schemas"]["gateway.api.v1.user.userinfo.UserInfo"];
            common?: components["schemas"]["gateway.api.v1.user.userinfo.CommonResp"];
        };
        "gateway.api.v1.video.comment.CommentInfo": {
            commentId?: string;
            publisherId?: string;
            rootId?: string;
            content?: string;
            /** Format: date-time */
            createdAt?: string;
            upvoteCount?: string;
            ipAddress?: string;
            /** Format: uint32 */
            cntReplies?: number;
        };
        "gateway.api.v1.video.comment.CommentVideoReq": {
            videoId?: string;
            parentId?: string;
            content?: string;
        };
        "gateway.api.v1.video.comment.CommentVideoResp": {
            commentId?: string;
        };
        "gateway.api.v1.video.comment.GetCommentListResp": {
            comments?: components["schemas"]["gateway.api.v1.video.comment.CommentInfo"][];
            /** Format: int32 */
            totalCount?: number;
        };
        "gateway.api.v1.video.comment.GetCommentRepliesResp": {
            replies?: components["schemas"]["gateway.api.v1.video.comment.CommentInfo"][];
        };
        "gateway.api.v1.video.comment.UpvoteCommentReq": {
            commentId?: string;
            videoId?: string;
            /**
             * @description If is_upvote is true, the user has upvoted the comment before, so we need to cancel the upvote.
             *      Otherwise, the user has not upvoted the comment before, so we need to add the upvote.
             */
            isUpvote?: boolean;
        };
        "gateway.api.v1.video.comment.UpvoteCommentResp": {
            /** Format: int32 */
            statusCode?: number;
            message?: string;
        };
        "gateway.api.v1.video.interact.VideoFavoriteReq": {
            videoId?: string;
            favoriteId?: string;
        };
        "gateway.api.v1.video.interact.VideoFavoriteResp": {
            /** Format: int32 */
            statusCode?: number;
            message?: string;
        };
        "gateway.api.v1.video.interact.VideoSendBarrageReq": {
            videoId?: string;
            content?: string;
            color?: string;
            time?: string;
            upvoteCount?: string;
        };
        "gateway.api.v1.video.interact.VideoSendBarrageResp": {
            /** Format: int32 */
            statusCode?: number;
            message?: string;
        };
        "gateway.api.v1.video.interact.VideoShareResp": {
            /** Format: int32 */
            statusCode?: number;
            message?: string;
            url?: string;
        };
        "gateway.api.v1.video.interact.VideoThrowShellsReq": {
            videoId?: string;
            /** Format: int32 */
            shells?: number;
        };
        "gateway.api.v1.video.interact.VideoThrowShellsResp": {
            /** Format: int32 */
            statusCode?: number;
            message?: string;
        };
        "gateway.api.v1.video.interact.VideoUpvoteBarrageReq": {
            videoId?: string;
            barrageId?: string;
        };
        "gateway.api.v1.video.interact.VideoUpvoteBarrageResp": {
            /** Format: int32 */
            statusCode?: number;
            message?: string;
        };
        "gateway.api.v1.video.interact.VideoUpvoteReq": {
            videoId?: string;
        };
        "gateway.api.v1.video.interact.VideoUpvoteResp": {
            /** Format: int32 */
            statusCode?: number;
            message?: string;
        };
        "gateway.api.v1.video.videoinfo.CommonResp": {
            /** Format: int32 */
            statusCode?: number;
            message?: string;
        };
        "gateway.api.v1.video.videoinfo.FileResp": {
            filePath?: string;
            filename?: string;
            headers?: {
                [key: string]: components["schemas"]["gateway.api.v1.video.videoinfo.FileResp_HeaderValues"];
            };
        };
        "gateway.api.v1.video.videoinfo.FileResp_HeaderValues": {
            value?: string[];
        };
        "gateway.api.v1.video.videoinfo.GetVideoInfoResp": {
            videoDetail?: components["schemas"]["gateway.api.v1.video.videoinfo.VideoMetaInfo"];
        };
        "gateway.api.v1.video.videoinfo.GetVideoListResp": {
            VideoSummary?: components["schemas"]["gateway.api.v1.video.videoinfo.VideoSummary"][];
        };
        "gateway.api.v1.video.videoinfo.UploadVideoCoverReq": {
            userId?: string;
            videoId?: string;
        };
        "gateway.api.v1.video.videoinfo.UploadVideoCoverResp": {
            resp?: components["schemas"]["gateway.api.v1.video.videoinfo.CommonResp"];
        };
        "gateway.api.v1.video.videoinfo.UploadVideoFileReq": {
            userId?: string;
            videoId?: string;
        };
        "gateway.api.v1.video.videoinfo.UploadVideoFileResp": {
            resp?: components["schemas"]["gateway.api.v1.video.videoinfo.CommonResp"];
        };
        "gateway.api.v1.video.videoinfo.UploadVideoInfoReq": {
            userId?: string;
            videoInfo?: components["schemas"]["gateway.api.v1.video.videoinfo.VideoMetaInfo"];
        };
        "gateway.api.v1.video.videoinfo.UploadVideoInfoResp": {
            resp?: components["schemas"]["gateway.api.v1.video.videoinfo.CommonResp"];
            videoId?: string;
        };
        "gateway.api.v1.video.videoinfo.VideoMetaInfo": {
            videoId?: string;
            publisherId?: string;
            publisherName?: string;
            title?: string;
            description?: string;
            videoPath?: string;
            classes?: string[];
            tags?: string[];
            hot?: string;
            /** Format: date-time */
            createdTime?: string;
            records?: components["schemas"]["gateway.api.v1.video.videoinfo.VideoMetaInfo_Records"];
            duration?: string;
            coverPath?: string;
        };
        "gateway.api.v1.video.videoinfo.VideoMetaInfo_Records": {
            /** Format: uint32 */
            cntBarrages?: number;
            /** Format: uint32 */
            cntShares?: number;
            /** Format: uint32 */
            cntViewed?: number;
            /** Format: uint32 */
            cntFavorites?: number;
        };
        "gateway.api.v1.video.videoinfo.VideoSummary": {
            videoId?: string;
            cntBarrages?: string;
            cntViewed?: string;
            title?: string;
            duration?: string;
            publisherName?: string;
            coverPath?: string;
            description?: string;
            videoPath?: string;
            /** Format: date-time */
            createdTime?: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    Captcha_GetCodeCaptcha: {
        parameters: {
            query?: {
                email?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.user.captcha.GetCodeCaptchaResp"];
                };
            };
        };
    };
    Captcha_GetImageCaptcha: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.user.captcha.GetImageCaptchaResp"];
                };
            };
        };
    };
    Favorite_CreateFavorites: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["gateway.api.v1.user.favorites.CreateFavoritesReq"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.user.favorites.CreateFavoritesResp"];
                };
            };
        };
    };
    Favorite_DeleteFavorites: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                favoritesId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.user.favorites.DeleteFavoritesResp"];
                };
            };
        };
    };
    Favorite_ModifyFavorites: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                favoritesId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["gateway.api.v1.user.favorites.ModifyFavoritesReq"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.user.favorites.ModifyFavoritesResp"];
                };
            };
        };
    };
    Identity_Login: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["gateway.api.v1.user.id.LoginRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.user.id.LoginResp"];
                };
            };
        };
    };
    FileService_UploadAvatar: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    /** Format: binary */
                    avatar: string;
                };
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.user.file.UploadAvatarResp"];
                };
            };
        };
    };
    Identity_Register: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["gateway.api.v1.user.id.RegisterRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.user.id.RegisterResp"];
                };
            };
        };
    };
    Identity_Logout: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                userId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["gateway.api.v1.user.id.LogoutRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.user.id.LogoutResp"];
                };
            };
        };
    };
    Userinfo_Userinfo: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                userId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.user.userinfo.UserinfoResp"];
                };
            };
        };
    };
    Userinfo_ForgetPassword: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                userId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["gateway.api.v1.user.userinfo.ForgetPasswordReq"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.user.userinfo.ForgetPasswordResp"];
                };
            };
        };
    };
    Userinfo_ModifyEmail: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                userId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["gateway.api.v1.user.userinfo.ModifyEmailReq"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.user.userinfo.ModifyEmailResp"];
                };
            };
        };
    };
    Userinfo_ModifyPassword: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                userId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["gateway.api.v1.user.userinfo.ModifyPasswordReq"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.user.userinfo.ModifyPasswordResp"];
                };
            };
        };
    };
    Userinfo_ModifyUserSignature: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                userId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["gateway.api.v1.user.userinfo.ModifySignatureReq"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.user.userinfo.ModifySignatureResp"];
                };
            };
        };
    };
    Userinfo_ModifyUsername: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                userId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["gateway.api.v1.user.userinfo.ModifyUsernameReq"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.user.userinfo.ModifyUsernameResp"];
                };
            };
        };
    };
    VideoInteract_VideoSendBarrage: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                videoId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["gateway.api.v1.video.interact.VideoSendBarrageReq"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.video.interact.VideoSendBarrageResp"];
                };
            };
        };
    };
    VideoInteract_VideoUpvoteBarrage: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                videoId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["gateway.api.v1.video.interact.VideoUpvoteBarrageReq"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.video.interact.VideoUpvoteBarrageResp"];
                };
            };
        };
    };
    VideoInteract_VideoFavorite: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                videoId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["gateway.api.v1.video.interact.VideoFavoriteReq"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.video.interact.VideoFavoriteResp"];
                };
            };
        };
    };
    VideoInteract_VideoShare: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                videoId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.video.interact.VideoShareResp"];
                };
            };
        };
    };
    VideoInteract_VideoThrowShells: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                videoId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["gateway.api.v1.video.interact.VideoThrowShellsReq"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.video.interact.VideoThrowShellsResp"];
                };
            };
        };
    };
    VideoInteract_VideoUpvote: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                videoId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["gateway.api.v1.video.interact.VideoUpvoteReq"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.video.interact.VideoUpvoteResp"];
                };
            };
        };
    };
    VideoInfo_GetVideoList: {
        parameters: {
            query?: {
                class?: string[];
                pageNum?: number;
                pageSize?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.video.videoinfo.GetVideoListResp"];
                };
            };
        };
    };
    VideoComment_GetCommentList: {
        parameters: {
            query?: {
                pageNum?: number;
                pageSize?: number;
                sortBy?: string;
                order?: string;
            };
            header?: never;
            path: {
                videoId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.video.comment.GetCommentListResp"];
                };
            };
        };
    };
    VideoComment_CommentVideo: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                videoId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["gateway.api.v1.video.comment.CommentVideoReq"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.video.comment.CommentVideoResp"];
                };
            };
        };
    };
    VideoComment_UpvoteComment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                videoId: string;
                commentId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["gateway.api.v1.video.comment.UpvoteCommentReq"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.video.comment.UpvoteCommentResp"];
                };
            };
        };
    };
    VideoComment_GetCommentReplies: {
        parameters: {
            query?: {
                pageNum?: number;
                pageSize?: number;
                sortBy?: string;
                order?: string;
            };
            header?: never;
            path: {
                videoId: string;
                commentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.video.comment.GetCommentRepliesResp"];
                };
            };
        };
    };
    VideoInfo_GetVideoInfo: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                videoId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.video.videoinfo.GetVideoInfoResp"];
                };
            };
        };
    };
    Follow_UnfollowUser: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                userId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["gateway.api.v1.user.follow.UnfollowUserReq"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.user.follow.UnfollowUserResp"];
                };
            };
        };
    };
    Follow_FollowUser: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                userId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["gateway.api.v1.user.follow.FollowUserReq"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.user.follow.FollowUserResp"];
                };
            };
        };
    };
    Follow_GetFolloweeInfo: {
        parameters: {
            query?: {
                followListId?: string;
                pageNum?: number;
                pageSize?: number;
            };
            header?: never;
            path: {
                userId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.user.follow.GetFolloweeInfoResp"];
                };
            };
        };
    };
    FileService_UpdateAvatar: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                userId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    /** Format: binary */
                    avatar: string;
                };
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.user.file.UpdateAvatarResp"];
                };
            };
        };
    };
    VideoInfo_UploadVideoInfo: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                userId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["gateway.api.v1.video.videoinfo.UploadVideoInfoReq"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.video.videoinfo.UploadVideoInfoResp"];
                };
            };
        };
    };
    VideoInfo_GetVideoCover: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                userId: string;
                videoId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/octet-stream": string;
                };
            };
        };
    };
    VideoInfo_UploadVideoCover: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                userId: string;
                videoId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    /** Format: binary */
                    cover: string;
                };
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.video.videoinfo.UploadVideoCoverResp"];
                };
            };
        };
    };
    VideoInfo_GetMpd: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                userId: string;
                videoId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/dash+xml": string;
                };
            };
        };
    };
    VideoInfo_GetSegments: {
        parameters: {
            query?: {
                /** @description 保留旧字段编号以识别旧请求；非空时拒绝，不再接受服务器文件路径。 */
                segmentPath?: string;
            };
            header?: never;
            path: {
                userId: string;
                videoId: string;
                /** @description MPD 中的单个 .m4s 文件名，不包含目录或 URL。 */
                segmentName: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/octet-stream": string;
                };
            };
        };
    };
    VideoInfo_DownloadVideo: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                userId: string;
                videoId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/octet-stream": string;
                };
            };
        };
    };
    VideoInfo_UploadVideoFile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                userId: string;
                videoId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    /** Format: binary */
                    file: string;
                };
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.video.videoinfo.UploadVideoFileResp"];
                };
            };
        };
    };
}
