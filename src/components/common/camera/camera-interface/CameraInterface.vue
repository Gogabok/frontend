<template lang="pug">
    .camera(:class="{ 'small': src.length }")
      .camera__container()
        video.camera__video(
          v-if="!src.length || interfaceType === 'video'"
          playsinline,
          muted,
          ref="video",
        )
        img.camera__image(
          :src="src",
          alt="Taken photo",
          v-if="src.length && interfaceType === 'photo'",
        )

        template(v-if="src.length && interfaceType === 'video'")
          .camera__container-button(@click="toggleVideo")
            transition(:duration="200", name="fade", mode="out-in")
              .camera__container-button-item(v-if="!isVideoBeingPlayed")
                play-icon(white)

      transition(name="fade")
        .camera__controls(v-if="!src.length")
          span.camera__cancel(@click="closeCamera")
            plus-icon

          button.camera__photo(
            @click="\
              interfaceType === 'photo'\
                ? takePhoto()\
                : toggleVideoRecording()\
              ",
            :class="{\
              'camera__photo-video': interfaceType === 'video',\
              'camera__photo-active': isVideoBeingRecorded,\
            }",
          )

          .camera__icons
            transition(name="fade")
              span.camera__rotate(
                v-if="!isVideoBeingRecorded && videoDevicesAmount > 1"
                @click="rotateCamera",
                ref="rotateIcon",
              )
                rotate-icon

            transition(name="fade")
              p.camera__counter.camera__counter-active(
                ref="counterBox",
                v-if="interfaceType === 'video' && isVideoBeingRecorded",
              )
                | {{secCounter.minutes | doubleFormat}}:{{secCounter.seconds | doubleFormat}}:{{secCounter.milliSeconds | doubleFormat}}
</template>

<script src="./CameraInterface.ts" lang="ts"></script>

<style src="./camera-interface.styl" lang="stylus" scoped></style>
