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
        put: operations["FileService_UpdateAvatar"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/users/{userId}/avatar": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description 公开读取头像二进制；用户不存在返回 404，头像文件缺失时回退共享默认头像。 */
        get: operations["FileService_GetAvatar"];
        put?: never;
        post?: never;
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
    "/api/v1/userinfo/forgetPassword": {
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
    "/api/v1/video/{videoId}/upload-status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description 发布者查询视频的上传和处理进度。业务失败通过响应体的 code、reason 和 message 返回。 */
        get: operations["VideoInfo_GetVideoUploadStatus"];
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
    "/api/v1/{userId}/video/metaInfo": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description 投稿顺序为上传视频元信息、封面、原片。 */
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
        /** @description 原片落盘后返回，视频服务随后在后台生成 DASH。 */
        post: operations["VideoInfo_UploadVideoFile"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/favorites/list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description 获取当前登录用户的全部收藏夹，包含公开和私密收藏夹。 */
        get: operations["Favorite_GetFavoritesList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/favorites/{favoritesId}/videos": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description 登录后分页读取本人收藏夹或其他用户的公开收藏夹。 */
        get: operations["VideoInfo_GetFavoriteVideos"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/follow-lists": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Follow_GetFollowLists"];
        put?: never;
        post: operations["Follow_CreateFollowList"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/follow-lists/batch-delete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Follow_DeleteFollowLists"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/follow-lists/{followListId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["Follow_ModifyFollowList"];
        trace?: never;
    };
    "/api/v1/follow-lists/{followListId}/default": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: operations["Follow_SetDefaultFollowList"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/follow/relations/{targetUserId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Follow_GetFollowRelation"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/follow/relations/{targetUserId}/list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: operations["Follow_MoveFollowee"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/video/{videoId}/barrages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["VideoInteract_GetBarrages"];
        put?: never;
        post?: never;
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
            /** @description 保留兼容字段；实际创建者以网关鉴权上下文为准。 */
            userId?: string;
        };
        "gateway.api.v1.user.favorites.CreateFavoritesResp": {
            /** Format: int32 */
            statusCode?: number;
            msg?: string;
            /** @description 数据库保存成功后的收藏夹 ID。 */
            favoriteId?: string;
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
        "gateway.api.v1.user.file.UpdateAvatarResp": {
            /** Format: int32 */
            statusCode?: number;
            message?: string;
            /** @description 浏览器可访问的 API 相对地址，不是磁盘路径。 */
            avatarUrl?: string;
        };
        "gateway.api.v1.user.follow.FollowUserReq": {
            userId?: string;
            /** @description 旧字段名，实际表示被关注的目标用户，不是操作人。 */
            followerUserId?: string;
            followListId?: string;
        };
        "gateway.api.v1.user.follow.FollowUserResp": {
            /** Format: int32 */
            statusCode?: number;
            message?: string;
            isFollowing?: boolean;
            followListId?: string;
        };
        "gateway.api.v1.user.follow.GetFolloweeInfoResp": {
            /** Format: int32 */
            statusCode?: number;
            message?: string;
            followeeInfo?: components["schemas"]["gateway.api.v1.user.follow.GetFolloweeInfoResp_UserSummary"][];
            total?: string;
            /** Format: int32 */
            pageNum?: number;
            /** Format: int32 */
            pageSize?: number;
        };
        "gateway.api.v1.user.follow.GetFolloweeInfoResp_UserSummary": {
            username?: string;
            /** @description 头像 API 相对 URL，保留原字段名，不再返回服务器路径。 */
            avatarPath?: string;
            /** Format: int32 */
            gender?: number;
            signature?: string;
            email?: string;
            /** Format: date-time */
            birthday?: string;
            /** @description 被关注用户的 ID，用于用户主页跳转和关注关系操作。 */
            userId?: string;
            followListId?: string;
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
            /** @description 注册成功创建的用户 ID，与 access token 中身份一致。 */
            userId?: string;
        };
        "gateway.api.v1.user.userinfo.CommonResp": {
            /** Format: int32 */
            status?: number;
            message?: string;
        };
        "gateway.api.v1.user.userinfo.ForgetPasswordReq": {
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
            /** @description 头像 API 相对 URL，保留原字段名，不再返回服务器路径。 */
            avatarPath?: string;
            /** Format: int32 */
            gender?: number;
            birthday?: string;
        };
        "gateway.api.v1.user.userinfo.UserinfoResp": {
            userInfo?: components["schemas"]["gateway.api.v1.user.userinfo.UserInfo"];
            common?: components["schemas"]["gateway.api.v1.user.userinfo.CommonResp"];
        };
        /** @description CommentCursor 保存上一批最后一条评论的位置，不能跨视频、楼层或排序复用。 */
        "gateway.api.v1.video.comment.CommentCursor": {
            /** @description 所属视频 ID，必须与本次请求一致。 */
            videoId?: string;
            /** @description 主评论列表为 0，回复列表为所属主评论 ID。 */
            rootId?: string;
            /** @description 排序字段：created_at 或 cnt_upvote。 */
            sortBy?: string;
            /** @description 排序方向：asc 或 desc；热度排序只允许 desc。 */
            order?: string;
            /** @description 上一批最后一条已返回评论的 ID，用于同值排序。 */
            commentId?: string;
            /**
             * Format: date-time
             * @description 该评论的创建时间；按时间排序时必须提供。
             */
            createdAt?: string;
            /** @description 该评论在读取时的点赞数；不是固定的热度快照。 */
            upvoteCount?: string;
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
            parentId?: string;
            isUpvoted?: boolean;
            reference?: components["schemas"]["gateway.api.v1.video.comment.CommentReference"];
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
            /** @description 仅有下一批时返回，否则为空。 */
            nextCursor?: components["schemas"]["gateway.api.v1.video.comment.CommentCursor"];
            hasMore?: boolean;
        };
        "gateway.api.v1.video.comment.GetCommentRepliesResp": {
            replies?: components["schemas"]["gateway.api.v1.video.comment.CommentInfo"][];
            /** @description 仅有下一批时返回，否则为空。 */
            nextCursor?: components["schemas"]["gateway.api.v1.video.comment.CommentCursor"];
            hasMore?: boolean;
        };
        "gateway.api.v1.video.comment.UpvoteCommentReq": {
            commentId?: string;
            videoId?: string;
            liked?: boolean;
        };
        "gateway.api.v1.video.comment.UpvoteCommentResp": {
            /** Format: int32 */
            statusCode?: number;
            message?: string;
            isUpvoted?: boolean;
            upvoteCount?: string;
        };
        "gateway.api.v1.video.interact.VideoFavoriteReq": {
            videoId?: string;
            favoriteId?: string;
            /**
             * Format: int32
             * @description 1 表示收藏，-1 表示取消；不再根据当前状态自动切换。
             */
            favorite?: number;
            /** @description 取消时必须携带当前收藏记录 ID，收藏时必须为 0。 */
            favoriteRecordId?: string;
        };
        "gateway.api.v1.video.interact.VideoFavoriteResp": {
            /** Format: int32 */
            statusCode?: number;
            message?: string;
            isFavorited?: boolean;
            favoriteId?: string;
            favoriteRecordId?: string;
        };
        "gateway.api.v1.video.interact.VideoSendBarrageReq": {
            videoId?: string;
            content?: string;
            color?: string;
            /** Format: int32 */
            positionSecond?: number;
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
            liked?: boolean;
        };
        "gateway.api.v1.video.interact.VideoUpvoteBarrageResp": {
            /** Format: int32 */
            statusCode?: number;
            message?: string;
            isUpvoted?: boolean;
            upvoteCount?: string;
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
            /** @description 游客不返回个人状态；身份仅由鉴权上下文确定。 */
            userVideoStatus?: components["schemas"]["gateway.api.v1.video.videoinfo.UserVideoStatus"];
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
        "gateway.api.v1.user.favorites.FavoriteDetail": {
            favoriteId?: string;
            favoriteName?: string;
            description?: string;
            /** @description true 表示私密，对应数据库 is_private=-1；false 表示公开。 */
            isPrivate?: boolean;
        };
        "gateway.api.v1.user.favorites.GetFavoritesListResp": {
            userId?: string;
            favoriteList?: components["schemas"]["gateway.api.v1.user.favorites.FavoriteDetail"][];
        };
        "gateway.api.v1.video.videoinfo.FavoriteVideoItem": {
            video?: components["schemas"]["gateway.api.v1.video.videoinfo.VideoSummary"];
            /**
             * Format: date-time
             * @description 收藏时间，不改变 video.created_time 的视频发布时间语义；历史空时间返回 null。
             */
            collectedAt?: string;
        };
        "gateway.api.v1.video.videoinfo.GetFavoriteVideosResp": {
            videos?: components["schemas"]["gateway.api.v1.video.videoinfo.FavoriteVideoItem"][];
            total?: string;
            /** Format: int32 */
            pageNum?: number;
            /** Format: int32 */
            pageSize?: number;
        };
        "gateway.api.v1.video.videoinfo.GetVideoUploadStatusResp": {
            /** @enum {string} */
            status?: "waiting_cover" | "waiting_video" | "uploading" | "processing" | "completed" | "failed";
            /**
             * Format: date-time
             * @description 最近一次状态更新时间。已完成记录清理后，此字段为空。
             */
            updatedTime?: string | null;
            /** @description 上传或处理失败时的提示。 */
            uploadErrorMsg?: string;
        };
        /** @description UserVideoStatus 与下游个人状态字段对齐，1 表示已操作，-1 表示未操作。 */
        "gateway.api.v1.video.videoinfo.UserVideoStatus": {
            /** Format: int32 */
            isUpvoted?: number;
            /** Format: int32 */
            isFavorited?: number;
            /** Format: int32 */
            isShared?: number;
            /** Format: int32 */
            isThrownShells?: number;
            /** @description 未收藏时为 0，已收藏时为当前用户的收藏夹 ID。 */
            favoriteId?: string;
            /** @description 当前有效收藏记录 ID，取消操作必须携带。 */
            favoriteRecordId?: string;
        };
        /** @description user_id 不作为身份来源，网关只使用鉴权 context 中的当前用户。 */
        "gateway.api.v1.user.follow.CreateFollowListReq": {
            userId?: string;
            name?: string;
        };
        "gateway.api.v1.user.follow.CreateFollowListResp": {
            followListId?: string;
        };
        "gateway.api.v1.user.follow.DeleteFollowListsReq": {
            idList?: string[];
        };
        "gateway.api.v1.user.follow.FollowListInfo": {
            followListId?: string;
            userId?: string;
            name?: string;
            isDefault?: boolean;
        };
        "gateway.api.v1.user.follow.FollowListMutationResp": {
            success?: boolean;
        };
        "gateway.api.v1.user.follow.GetFollowListsResp": {
            lists?: components["schemas"]["gateway.api.v1.user.follow.FollowListInfo"][];
        };
        "gateway.api.v1.user.follow.GetFollowRelationResp": {
            isFollowing?: boolean;
            followListId?: string;
        };
        "gateway.api.v1.user.follow.ModifyFollowListReq": {
            followListId?: string;
            name?: string;
        };
        "gateway.api.v1.user.follow.MoveFolloweeReq": {
            targetUserId?: string;
            followListId?: string;
        };
        "gateway.api.v1.user.follow.SetDefaultFollowListReq": {
            followListId?: string;
        };
        /** @description CommentReference 返回直接回复对象的完整正文，展示截断由前端负责。 */
        "gateway.api.v1.video.comment.CommentReference": {
            commentId?: string;
            publisherId?: string;
            content?: string;
            unavailable?: boolean;
        };
        /** @description BarrageCursor 保存上一批最后一条弹幕的位置，绑定原视频及播放区间。 */
        "gateway.api.v1.video.interact.BarrageCursor": {
            /** @description 所属视频 ID，必须与本次请求一致。 */
            videoId?: string;
            /**
             * Format: int32
             * @description 原查询区间起点，单位为非负整数秒，包含该秒。
             */
            startSecond?: number;
            /**
             * Format: int32
             * @description 原查询区间终点，单位为整数秒，不包含该秒。
             */
            endSecond?: number;
            /**
             * Format: int32
             * @description 上一批最后一条已返回弹幕的播放位置，单位为整数秒。
             */
            positionSecond?: number;
            /** @description 该弹幕的 ID，用于继续读取同秒的其他弹幕。 */
            barrageId?: string;
        };
        "gateway.api.v1.video.interact.BarrageInfo": {
            barrageId?: string;
            publisherId?: string;
            videoId?: string;
            content?: string;
            color?: string;
            /** Format: int32 */
            positionSecond?: number;
            upvoteCount?: string;
            isUpvoted?: boolean;
        };
        "gateway.api.v1.video.interact.GetBarragesResp": {
            barrages?: components["schemas"]["gateway.api.v1.video.interact.BarrageInfo"][];
            /** @description 仅有下一批时返回，否则为空。 */
            nextCursor?: components["schemas"]["gateway.api.v1.video.interact.BarrageCursor"];
            hasMore?: boolean;
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
                /** @description 必填用途：register、change_email 或 reset_password。 */
                purpose?: string;
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
    FileService_UpdateAvatar: {
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
                    "application/json": components["schemas"]["gateway.api.v1.user.file.UpdateAvatarResp"];
                };
            };
        };
    };
    FileService_GetAvatar: {
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
            /** @description 头像图片，响应包含 ETag、Cache-Control 和 nosniff。 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "image/jpeg": string;
                    "image/png": string;
                };
            };
            /** @description If-None-Match 与当前头像内容一致，无响应正文。 */
            304: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
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
            path?: never;
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
                page_num?: number;
                page_size?: number;
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
                sort_by?: string;
                order?: string;
                /** @description 所属视频 ID，必须与本次请求一致。 */
                "cursor.video_id"?: string;
                /** @description 主评论列表为 0，回复列表为所属主评论 ID。 */
                "cursor.root_id"?: string;
                /** @description 排序字段：created_at 或 cnt_upvote。 */
                "cursor.sort_by"?: string;
                /** @description 排序方向：asc 或 desc；热度排序只允许 desc。 */
                "cursor.order"?: string;
                /** @description 上一批最后一条已返回评论的 ID，用于同值排序。 */
                "cursor.comment_id"?: string;
                /** @description 该评论的创建时间；按时间排序时必须提供。 */
                "cursor.created_at"?: string;
                /** @description 该评论在读取时的点赞数；不是固定的热度快照。 */
                "cursor.upvote_count"?: string;
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
                sort_by?: string;
                order?: string;
                /** @description 所属视频 ID，必须与本次请求一致。 */
                "cursor.video_id"?: string;
                /** @description 主评论列表为 0，回复列表为所属主评论 ID。 */
                "cursor.root_id"?: string;
                /** @description 排序字段：created_at 或 cnt_upvote。 */
                "cursor.sort_by"?: string;
                /** @description 排序方向：asc 或 desc；热度排序只允许 desc。 */
                "cursor.order"?: string;
                /** @description 上一批最后一条已返回评论的 ID，用于同值排序。 */
                "cursor.comment_id"?: string;
                /** @description 该评论的创建时间；按时间排序时必须提供。 */
                "cursor.created_at"?: string;
                /** @description 该评论在读取时的点赞数；不是固定的热度快照。 */
                "cursor.upvote_count"?: string;
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
    VideoInfo_GetVideoUploadStatus: {
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
                    "application/json": components["schemas"]["gateway.api.v1.video.videoinfo.GetVideoUploadStatusResp"];
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
                follow_list_id?: string;
                page_num?: number;
                page_size?: number;
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
                segment_path?: string;
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
    Favorite_GetFavoritesList: {
        parameters: {
            query?: {
                /** @description 保留兼容字段；查询对象始终是当前登录用户。 */
                user_id?: string;
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
                    "application/json": components["schemas"]["gateway.api.v1.user.favorites.GetFavoritesListResp"];
                };
            };
        };
    };
    VideoInfo_GetFavoriteVideos: {
        parameters: {
            query?: {
                /** @description 省略时分别使用第 1 页和每页 20 条；每页最多 100 条。 */
                page_num?: number;
                page_size?: number;
            };
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
                    "application/json": components["schemas"]["gateway.api.v1.video.videoinfo.GetFavoriteVideosResp"];
                };
            };
        };
    };
    Follow_GetFollowLists: {
        parameters: {
            query?: {
                user_id?: string;
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
                    "application/json": components["schemas"]["gateway.api.v1.user.follow.GetFollowListsResp"];
                };
            };
        };
    };
    Follow_CreateFollowList: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["gateway.api.v1.user.follow.CreateFollowListReq"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.user.follow.CreateFollowListResp"];
                };
            };
        };
    };
    Follow_DeleteFollowLists: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["gateway.api.v1.user.follow.DeleteFollowListsReq"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.user.follow.FollowListMutationResp"];
                };
            };
        };
    };
    Follow_ModifyFollowList: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                followListId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["gateway.api.v1.user.follow.ModifyFollowListReq"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.user.follow.FollowListMutationResp"];
                };
            };
        };
    };
    Follow_SetDefaultFollowList: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                followListId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["gateway.api.v1.user.follow.SetDefaultFollowListReq"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.user.follow.FollowListMutationResp"];
                };
            };
        };
    };
    Follow_GetFollowRelation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                targetUserId: string;
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
                    "application/json": components["schemas"]["gateway.api.v1.user.follow.GetFollowRelationResp"];
                };
            };
        };
    };
    Follow_MoveFollowee: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                targetUserId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["gateway.api.v1.user.follow.MoveFolloweeReq"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["gateway.api.v1.user.follow.FollowListMutationResp"];
                };
            };
        };
    };
    VideoInteract_GetBarrages: {
        parameters: {
            query?: {
                start_second?: number;
                end_second?: number;
                /** @description 所属视频 ID，必须与本次请求一致。 */
                "cursor.video_id"?: string;
                /** @description 原查询区间起点，单位为非负整数秒，包含该秒。 */
                "cursor.start_second"?: number;
                /** @description 原查询区间终点，单位为整数秒，不包含该秒。 */
                "cursor.end_second"?: number;
                /** @description 上一批最后一条已返回弹幕的播放位置，单位为整数秒。 */
                "cursor.position_second"?: number;
                /** @description 该弹幕的 ID，用于继续读取同秒的其他弹幕。 */
                "cursor.barrage_id"?: string;
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
                    "application/json": components["schemas"]["gateway.api.v1.video.interact.GetBarragesResp"];
                };
            };
        };
    };
}
