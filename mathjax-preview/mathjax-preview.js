MathPreview = {
  math_input: null,  // filled in by Init below
  delay: 150,        // delay after keystroke before updating
  preview: null,     // filled in by Init below
  buffer: null,      // filled in by Init below
  timeout: null,     // store setTimout id
  mjRunning: false,  // true when MathJax is processing
  oldText: null,     // used to check if an update is needed

  Init: function (math_input, preview_id, buffer_id) {
    this.math_input = document.getElementById(math_input);
    this.preview = document.getElementById(preview_id);
    this.buffer = document.getElementById(buffer_id);
  },
  SwapBuffers: function () {
    var buffer = this.preview, preview = this.buffer;
    this.buffer = buffer; this.preview = preview;
    buffer.style.visibility = "hidden"; buffer.style.position = "absolute";
    preview.style.position = ""; preview.style.visibility = "";
  },
  Update: function () {
    if (this.timeout) {clearTimeout(this.timeout)}
    this.timeout = setTimeout(this.callback,this.delay);
  },
  CreatePreview: function () {
    if (MathPreview !== undefined) MathPreview.timeout = null;
    if (this.mjRunning) return;
    var text = '$$' + this.math_input.value + ' $$'; // space avoids escaping $
    if (text === this.oldtext) return;
    this.buffer.innerHTML = this.oldtext = text;
    this.mjRunning = true;
    MathJax.Hub.Queue(
      ["Typeset", MathJax.Hub, this.buffer],
      ["PreviewDone", this]
    );
  },
  PreviewDone: function () {
    this.mjRunning = false;
    this.SwapBuffers();
  }
};
MathPreview.callback = MathJax.Callback(["CreatePreview", MathPreview]);
MathPreview.callback.autoReset = true;  // make sure it can run more than once